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
  local recorded_pid=""
  local stop_pid=""
  local current_port=""
  local current_pid=""
  local had_metadata="0"

  if [[ -f "$pid_file" || -f "$meta_file" ]]; then
    had_metadata="1"
  fi

  recorded_pid="$(read_pid "$pid_file")"
  current_port="$(meta_get "$meta_file" "PORT")"
  current_port="${current_port:-$fallback_port}"
  current_pid="$(port_pid "$current_port")"

  if pid_running "$recorded_pid"; then
    stop_pid="$recorded_pid"
  elif [[ -n "$current_pid" && "$had_metadata" == "1" ]]; then
    stop_pid="$current_pid"
    if [[ -n "$recorded_pid" ]]; then
      echo "[${service_name}] 托管 PID=${recorded_pid} 已失效，回退停止监听 PID=${current_pid}。"
    fi
  fi

  if [[ -z "$stop_pid" && -z "$current_pid" ]]; then
    rm -f "$pid_file" "$meta_file"
    echo "[${service_name}] 未发现运行中的托管进程，无需停止。"
    return 0
  fi

  if [[ -z "$stop_pid" ]]; then
    echo "[${service_name}] 端口 ${current_port} 仍被 PID=${current_pid} 占用，但不是脚本托管进程。"
    return 0
  fi

  if ! kill "$stop_pid" 2>/dev/null; then
    if ! pid_running "$stop_pid"; then
      rm -f "$pid_file" "$meta_file"
      echo "[${service_name}] 托管进程已退出，已清理 PID 与元数据文件。"
      return 0
    fi
    echo "[${service_name}] 停止失败，请手动结束 PID=${stop_pid}。"
    return 1
  fi

  for _ in {1..10}; do
    current_pid="$(port_pid "$current_port")"
    if ! pid_running "$stop_pid" && [[ -z "$current_pid" ]]; then
      rm -f "$pid_file" "$meta_file"
      echo "[${service_name}] 已停止，PID=${stop_pid}"
      return 0
    fi
    sleep 1
  done

  current_pid="$(port_pid "$current_port")"
  if [[ -n "$current_pid" && "$current_pid" != "$stop_pid" ]]; then
    kill -9 "$current_pid" 2>/dev/null || true
  fi

  if pid_running "$stop_pid"; then
    kill -9 "$stop_pid" 2>/dev/null || true
  fi

  for _ in {1..5}; do
    current_pid="$(port_pid "$current_port")"
    if ! pid_running "$stop_pid" && [[ -z "$current_pid" ]]; then
      rm -f "$pid_file" "$meta_file"
      echo "[${service_name}] 已强制停止，PID=${stop_pid}"
      return 0
    fi
    sleep 1
  done

  if ! pid_running "$stop_pid" && [[ -z "$current_pid" ]]; then
    rm -f "$pid_file" "$meta_file"
    echo "[${service_name}] 已强制停止，PID=${stop_pid}"
    return 0
  fi

  echo "[${service_name}] 停止超时，请手动结束 PID=${stop_pid}。"
  return 1
}

stop_service "web" "$WEB_PID_FILE" "$WEB_META_FILE" "$WEB_PORT"
stop_service "mock-server" "$MOCK_PID_FILE" "$MOCK_META_FILE" "$MOCK_PORT"
