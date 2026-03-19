#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/runtime"
PID_DIR="$RUNTIME_DIR/pids"
SERVICE_DIR="$RUNTIME_DIR/services"

MOCK_PORT="${MOCK_PORT:-3101}"
WEB_PORT="${WEB_PORT:-5173}"

MOCK_PID_FILE="$PID_DIR/mock-server.pid"
WEB_PID_FILE="$PID_DIR/web.pid"
MOCK_META_FILE="$SERVICE_DIR/mock-server.env"
WEB_META_FILE="$SERVICE_DIR/web.env"

port_pid() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true
  fi
}

meta_get() {
  local meta_file="$1"
  local key="$2"
  [[ -f "$meta_file" ]] || return 0
  awk -F= -v key="$key" '$1 == key { print substr($0, index($0, "=") + 1) }' "$meta_file"
}

stop_service() {
  local service_name="$1"
  local pid_file="$2"
  local meta_file="$3"
  local fallback_port="$4"
  local expected_pid=""
  local current_port=""
  local current_pid=""

  if [[ -f "$pid_file" ]]; then
    expected_pid="$(tr -d '[:space:]' < "$pid_file")"
  fi

  current_port="$(meta_get "$meta_file" "PORT")"
  current_port="${current_port:-$fallback_port}"
  current_pid="$(port_pid "$current_port")"

  if [[ -z "$expected_pid" ]]; then
    if [[ -n "$current_pid" ]]; then
      echo "[${service_name}] 端口 ${current_port} 仍被 PID=${current_pid} 占用，但不是脚本托管进程。"
      return 0
    fi
    echo "[${service_name}] 未发现 PID 文件，无需停止。"
    return 0
  fi

  if [[ -z "$current_pid" ]]; then
    rm -f "$pid_file" "$meta_file"
    echo "[${service_name}] 进程未监听端口 ${current_port}，已清理 PID 与元数据文件。"
    return 0
  fi

  if [[ "$current_pid" != "$expected_pid" ]]; then
    rm -f "$pid_file" "$meta_file"
    echo "[${service_name}] 端口 ${current_port} 当前 PID=${current_pid}，PID 文件记录=${expected_pid}，已清理旧元数据。"
    return 0
  fi

  if ! kill "$expected_pid" 2>/dev/null; then
    echo "[${service_name}] 停止失败，请手动结束 PID=${expected_pid}。"
    return 1
  fi

  for _ in {1..10}; do
    if [[ -z "$(port_pid "$current_port")" ]]; then
      rm -f "$pid_file" "$meta_file"
      echo "[${service_name}] 已停止，PID=${expected_pid}"
      return 0
    fi
    sleep 1
  done

  if kill -9 "$expected_pid" 2>/dev/null; then
    rm -f "$pid_file" "$meta_file"
    echo "[${service_name}] 已强制停止，PID=${expected_pid}"
    return 0
  fi

  echo "[${service_name}] 停止超时，请手动结束 PID=${expected_pid}。"
  return 1
}

stop_service "web" "$WEB_PID_FILE" "$WEB_META_FILE" "$WEB_PORT"
stop_service "mock-server" "$MOCK_PID_FILE" "$MOCK_META_FILE" "$MOCK_PORT"
