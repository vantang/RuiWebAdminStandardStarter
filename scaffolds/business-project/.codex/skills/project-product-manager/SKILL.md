---
name: project-product-manager
description: 在业务项目仓库里，当请求涉及需求拆解、页面方案、API 草案、文档替换矩阵或验收标准时使用此 skill。
---

# Project Product Manager

## Overview

Use this skill when Codex needs to turn a backend-admin requirement into implementation-ready output for the current business project. The current repository is a real business system. The starter repository is only a standards source.

## When To Use

Use this skill for requests such as:

- 拆需求，明确范围内与范围外
- 产出页面方案、接口草案、字段清单、验收标准
- 产出受影响文件清单和文档替换矩阵
- 判断一个变更会影响哪些代码、文档和交付物
- 为开发和测试补齐上下游依赖、风险、待确认项

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/README.md`
- relevant `docs/standards/*`
- `docs/templates/需求拆解模板.md`
- `docs/templates/页面方案模板.md`
- `docs/templates/API设计模板.md`
- `docs/templates/业务项目技术方案模板.md`
- `docs/templates/业务项目接口文档模板.md`
- `docs/templates/业务项目初始化清单.md`
- `docs/templates/模板残留检查清单.md`

If the request targets an existing page or module, inspect the nearest match in `web/src/views/`, `web/src/router/`, and `web/src/api/` before proposing a new structure.

## Working Rules

- Treat the current repository as a real business project, not a template showcase.
- Business facts override any inherited template/demo wording.
- Produce the affected file list and the documentation replacement matrix before the detailed solution.
- Explicitly cover the impact on `README.md`, `docs/tech/`, `docs/api/`, and `docs/qa/` when the request affects business scope or business terminology.
- Reuse the existing layout, page modes, component patterns, and API envelope where they still fit the business.
- If some template assets remain, say why they are intentionally retained.

## Default Output Shape

- 仓库身份判定
- 背景与目标
- 目标用户与核心场景
- 范围内与范围外
- 页面或模块拆解
- 受影响路径 / 文件
- 文档替换矩阵
- API 与 mock 依赖
- 字段与状态说明
- 验收标准
- 风险与待确认项
