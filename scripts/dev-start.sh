#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/runtime"
PID_DIR="$RUNTIME_DIR/pids"
LOG_DIR="$RUNTIME_DIR/logs"
SERVICE_DIR="$RUNTIME_DIR/services"

MOCK_DIR="$ROOT_DIR/mock-server"
WEB_DIR="$ROOT_DIR/web"

MOCK_HOST="${MOCK_HOST:-127.0.0.1}"
MOCK_PORT="${MOCK_PORT:-3101}"
WEB_HOST="${WEB_HOST:-0.0.0.0}"
WEB_PORT="${WEB_PORT:-5173}"

MOCK_PID_FILE="$PID_DIR/mock-server.pid"
WEB_PID_FILE="$PID_DIR/web.pid"
MOCK_LOG_FILE="$LOG_DIR/mock-server.log"
WEB_LOG_FILE="$LOG_DIR/web.log"
MOCK_META_FILE="$SERVICE_DIR/mock-server.env"
WEB_META_FILE="$SERVICE_DIR/web.env"

mkdir -p "$PID_DIR" "$LOG_DIR" "$SERVICE_DIR"

read_pid() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    tr -d '[:space:]' < "$pid_file"
  fi
}

pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

port_pid() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true
  fi
}

port_in_use() {
  local port="$1"
  [[ -n "$(port_pid "$port")" ]]
}

find_free_port() {
  local start_port="$1"
  local end_port=$((start_port + 30))
  local port
  for ((port = start_port; port <= end_port; port++)); do
    if ! port_in_use "$port"; then
      echo "$port"
      return 0
    fi
  done
  return 1
}

ensure_dependencies() {
  local workdir="$1"
  local name="$2"
  if [[ ! -d "$workdir/node_modules" ]]; then
    echo "[$name] node_modules 不存在，正在执行 npm install..."
    (cd "$workdir" && npm install)
  fi
}

meta_get() {
  local meta_file="$1"
  local key="$2"
  [[ -f "$meta_file" ]] || return 0
  awk -F= -v key="$key" '$1 == key { print substr($0, index($0, "=") + 1) }' "$meta_file"
}

write_meta() {
  local meta_file="$1"
  local service_name="$2"
  local pid="$3"
  local host="$4"
  local port="$5"
  local log_file="$6"
  cat > "$meta_file" <<EOF
SERVICE_NAME=$service_name
PID=$pid
HOST=$host
PORT=$port
LOG_FILE=$log_file
EOF
}

sync_pid_metadata() {
  local pid_file="$1"
  local meta_file="$2"
  local pid="$3"
  [[ -n "$pid" ]] || return 0
  echo "$pid" > "$pid_file"
  if [[ -f "$meta_file" ]]; then
    awk -F= -v pid="$pid" '
      $1 == "PID" { print "PID=" pid; next }
      { print }
    ' "$meta_file" > "${meta_file}.tmp"
    mv "${meta_file}.tmp" "$meta_file"
  fi
}

cleanup_stale() {
  local pid_file="$1"
  local meta_file="$2"
  local current_port=""
  local current_pid=""
  local saved_pid=""

  saved_pid="$(read_pid "$pid_file")"
  current_port="$(meta_get "$meta_file" "PORT")"

  if [[ -n "$current_port" ]]; then
    current_pid="$(port_pid "$current_port")"
  fi

  if [[ -n "$current_pid" ]]; then
    sync_pid_metadata "$pid_file" "$meta_file" "$current_pid"
    return 0
  fi

  rm -f "$pid_file" "$meta_file"
}

wait_until_port_listens() {
  local port="$1"
  local log_file="$2"
  local service_name="$3"

  for _ in {1..20}; do
    if port_in_use "$port"; then
      return 0
    fi
    sleep 1
  done

  echo "[$service_name] 启动失败，最近日志如下："
  if [[ -f "$log_file" ]]; then
    tail -n 40 "$log_file"
  fi
  return 1
}

resolve_port() {
  local requested_port="$1"
  local service_name="$2"
  local resolved_port="$requested_port"

  if port_in_use "$requested_port"; then
    resolved_port="$(find_free_port "$requested_port")" || {
      echo "[$service_name] 从端口 ${requested_port} 开始未找到可用端口。" >&2
      return 1
    }

    if [[ "$resolved_port" != "$requested_port" ]]; then
      echo "[$service_name] 端口 ${requested_port} 已被占用，自动切换到 ${resolved_port}。" >&2
    fi
  fi

  echo "$resolved_port"
}

start_mock() {
  cleanup_stale "$MOCK_PID_FILE" "$MOCK_META_FILE"

  local existing_pid existing_port current_pid actual_port
  existing_pid="$(read_pid "$MOCK_PID_FILE")"
  existing_port="$(meta_get "$MOCK_META_FILE" "PORT")"
  current_pid=""
  if [[ -n "$existing_port" ]]; then
    current_pid="$(port_pid "$existing_port")"
  fi

  if [[ -n "$existing_pid" && -n "$existing_port" && "$existing_pid" == "$current_pid" ]]; then
    echo "[mock-server] 已在运行：http://${MOCK_HOST}:${existing_port}"
    MOCK_RUNNING_PORT="$existing_port"
    return 0
  fi

  actual_port="$(resolve_port "$MOCK_PORT" "mock-server")"
  ensure_dependencies "$MOCK_DIR" "mock-server"
  echo "[mock-server] 正在启动..."
  (
    cd "$MOCK_DIR"
    nohup env HOST="$MOCK_HOST" PORT="$actual_port" node src/server.js > "$MOCK_LOG_FILE" 2>&1 &
    echo $! > "$MOCK_PID_FILE"
  )
  wait_until_port_listens "$actual_port" "$MOCK_LOG_FILE" "mock-server"
  write_meta "$MOCK_META_FILE" "mock-server" "$(read_pid "$MOCK_PID_FILE")" "$MOCK_HOST" "$actual_port" "$MOCK_LOG_FILE"
  sync_pid_metadata "$MOCK_PID_FILE" "$MOCK_META_FILE" "$(port_pid "$actual_port")"
  echo "[mock-server] 启动成功：http://${MOCK_HOST}:${actual_port}"
  MOCK_RUNNING_PORT="$actual_port"
}

start_web() {
  local mock_port="$1"
  cleanup_stale "$WEB_PID_FILE" "$WEB_META_FILE"

  local existing_pid existing_port current_pid actual_port
  existing_pid="$(read_pid "$WEB_PID_FILE")"
  existing_port="$(meta_get "$WEB_META_FILE" "PORT")"
  current_pid=""
  if [[ -n "$existing_port" ]]; then
    current_pid="$(port_pid "$existing_port")"
  fi

  if [[ -n "$existing_pid" && -n "$existing_port" && "$existing_pid" == "$current_pid" ]]; then
    echo "[web] 已在运行：http://localhost:${existing_port}"
    WEB_RUNNING_PORT="$existing_port"
    return 0
  fi

  actual_port="$(resolve_port "$WEB_PORT" "web")"
  ensure_dependencies "$WEB_DIR" "web"
  echo "[web] 正在启动..."
  (
    cd "$WEB_DIR"
    nohup env MOCK_PORT="$mock_port" npm run dev -- --host "$WEB_HOST" --port "$actual_port" --strictPort > "$WEB_LOG_FILE" 2>&1 &
    echo $! > "$WEB_PID_FILE"
  )
  wait_until_port_listens "$actual_port" "$WEB_LOG_FILE" "web"
  write_meta "$WEB_META_FILE" "web" "$(read_pid "$WEB_PID_FILE")" "$WEB_HOST" "$actual_port" "$WEB_LOG_FILE"
  sync_pid_metadata "$WEB_PID_FILE" "$WEB_META_FILE" "$(port_pid "$actual_port")"
  echo "[web] 启动成功：http://localhost:${actual_port}"
  WEB_RUNNING_PORT="$actual_port"
}

MOCK_RUNNING_PORT=""
WEB_RUNNING_PORT=""

start_mock
start_web "$MOCK_RUNNING_PORT"

cat <<EOF

一键启动完成
- 前端地址: http://localhost:${WEB_RUNNING_PORT}
- Mock API: http://${MOCK_HOST}:${MOCK_RUNNING_PORT}
- 前端日志: ${WEB_LOG_FILE}
- Mock 日志: ${MOCK_LOG_FILE}

停止服务:
- npm run dev:stop
- npm run dev:restart
- bash ./scripts/dev-stop.sh
EOF
