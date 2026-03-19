#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/runtime"
PID_DIR="$RUNTIME_DIR/pids"
LOG_DIR="$RUNTIME_DIR/logs"
SERVICE_DIR="$RUNTIME_DIR/services"

MOCK_HOST="${MOCK_HOST:-127.0.0.1}"
MOCK_PORT="${MOCK_PORT:-3101}"
WEB_PORT="${WEB_PORT:-5173}"

MOCK_PID_FILE="$PID_DIR/mock-server.pid"
WEB_PID_FILE="$PID_DIR/web.pid"
MOCK_META_FILE="$SERVICE_DIR/mock-server.env"
WEB_META_FILE="$SERVICE_DIR/web.env"
MOCK_LOG_FILE="$LOG_DIR/mock-server.log"
WEB_LOG_FILE="$LOG_DIR/web.log"

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

print_status() {
  local service_name="$1"
  local pid_file="$2"
  local meta_file="$3"
  local fallback_host="$4"
  local fallback_port="$5"
  local fallback_log="$6"
  local expected_pid=""
  local current_port=""
  local current_host=""
  local current_log=""
  local current_pid=""

  if [[ -f "$pid_file" ]]; then
    expected_pid="$(tr -d '[:space:]' < "$pid_file")"
  fi

  current_host="$(meta_get "$meta_file" "HOST")"
  current_port="$(meta_get "$meta_file" "PORT")"
  current_log="$(meta_get "$meta_file" "LOG_FILE")"

  current_host="${current_host:-$fallback_host}"
  current_port="${current_port:-$fallback_port}"
  current_log="${current_log:-$fallback_log}"
  current_pid="$(port_pid "$current_port")"

  if [[ -n "$expected_pid" && -n "$current_pid" && "$expected_pid" == "$current_pid" ]]; then
    echo "[${service_name}] 运行中，PID=${expected_pid}，地址=http://${current_host}:${current_port}，日志=${current_log}"
    return 0
  fi

  if [[ -n "$current_pid" ]]; then
    if [[ -n "$expected_pid" ]]; then
      echo "[${service_name}] 端口 ${current_port} 已监听，当前 PID=${current_pid}，PID 文件记录=${expected_pid}，日志=${current_log}"
      return 0
    fi
    echo "[${service_name}] 地址 http://${current_host}:${current_port} 已被 PID=${current_pid} 占用，但不是脚本托管进程"
    return 0
  fi

  echo "[${service_name}] 未运行"
}

print_status "web" "$WEB_PID_FILE" "$WEB_META_FILE" "0.0.0.0" "$WEB_PORT" "$WEB_LOG_FILE"
print_status "mock-server" "$MOCK_PID_FILE" "$MOCK_META_FILE" "$MOCK_HOST" "$MOCK_PORT" "$MOCK_LOG_FILE"
