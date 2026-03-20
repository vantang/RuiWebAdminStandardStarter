#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_SKILLS_DIR="$ROOT_DIR/scaffolds/business-project/.codex/skills"
FORCE=0
TARGET_DIR=""

usage() {
  echo "用法: bash ./scripts/init-business-project.sh [--force] <target-dir>"
  echo "示例: bash ./scripts/init-business-project.sh ."
  echo "重跑示例: bash ./scripts/init-business-project.sh --force ."
}

for arg in "$@"; do
  case "$arg" in
    --force)
      FORCE=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -n "$TARGET_DIR" ]]; then
        echo "[init-business-project] 只接受一个目标目录参数。" >&2
        usage
        exit 1
      fi
      TARGET_DIR="$arg"
      ;;
  esac
done

if [[ -z "$TARGET_DIR" ]]; then
  usage
  exit 1
fi

if [[ ! -d "$SOURCE_SKILLS_DIR" ]]; then
  echo "[init-business-project] 未找到业务项目 skills 源目录: $SOURCE_SKILLS_DIR" >&2
  exit 1
fi

TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
TARGET_CODEX_DIR="$TARGET_DIR/.codex"
TARGET_SKILLS_DIR="$TARGET_CODEX_DIR/skills"
MARKER_FILE="$TARGET_CODEX_DIR/.business-project-initialized"

mkdir -p "$TARGET_CODEX_DIR"

if [[ -f "$MARKER_FILE" && "$FORCE" -ne 1 ]]; then
  echo "[init-business-project] 检测到该仓库已完成业务项目初始化，默认拒绝重复执行。" >&2
  echo "[init-business-project] 如确需重装 skills，请显式执行: bash ./scripts/init-business-project.sh --force $TARGET_DIR" >&2
  exit 1
fi

if [[ -d "$TARGET_SKILLS_DIR" && "$FORCE" -ne 1 ]]; then
  echo "[init-business-project] 检测到目标仓库已存在 .codex/skills，默认拒绝覆盖。" >&2
  echo "[init-business-project] 如确需覆盖，请显式执行: bash ./scripts/init-business-project.sh --force $TARGET_DIR" >&2
  exit 1
fi

if [[ -d "$TARGET_SKILLS_DIR" ]]; then
  BACKUP_DIR="${TARGET_CODEX_DIR}/skills.template-backup.$(date +%Y%m%d%H%M%S)"
  mv "$TARGET_SKILLS_DIR" "$BACKUP_DIR"
  echo "[init-business-project] 已备份现有 skills 到: $BACKUP_DIR"
fi

mkdir -p "$TARGET_SKILLS_DIR"
cp -R "$SOURCE_SKILLS_DIR/." "$TARGET_SKILLS_DIR"

cat > "$MARKER_FILE" <<EOF
initialized_at=$(date +"%Y-%m-%d %H:%M:%S")
source_repo=$ROOT_DIR
force=$FORCE
EOF

cat <<EOF
[init-business-project] 已安装业务项目版 skills 到: $TARGET_SKILLS_DIR
[init-business-project] 初始化标记已写入: $MARKER_FILE

下一步建议：
1. 先完成 docs/templates/业务项目初始化清单.md
2. 再阅读 docs/examples/README.md，先理解示例文档包的完成形态
3. 再参考 docs/templates/业务项目README模板.md 写出首版 README
4. 再参考 docs/templates/业务项目技术方案模板.md 写出 docs/tech 下的首版技术方案
5. 再参考 docs/templates/业务项目接口文档模板.md 写出 docs/api 下的首版接口文档
6. 再参考 docs/templates/业务项目测试验收模板.md 写出首版测试与验收文档
7. 然后使用 docs/templates/AI业务项目启动提示词模板.md 组织首轮提示词
8. 开工前先让 AI 输出“受影响文件清单”和“文档替换矩阵”
EOF
