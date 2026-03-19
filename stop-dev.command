#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"
bash ./scripts/dev-stop.sh
read -r -p "按回车键关闭窗口..." _
