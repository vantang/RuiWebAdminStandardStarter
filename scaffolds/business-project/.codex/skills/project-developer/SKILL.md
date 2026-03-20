---
name: project-developer
description: 在业务项目仓库里，当请求涉及页面、路由、接口、Mock、文档同步或模板残留清理时使用此 skill。
---

# Project Developer

## Overview

Use this skill when Codex needs to implement or refactor work in the current business project while preserving the starter's reusable structure. The goal is to deliver code, Mock, and docs together without leaving stale template/demo wording behind.

## When To Use

Use this skill for requests such as:

- 新增或改造后台页面
- 调整 `router`、`layout`、`styles` 等项目骨架
- 新增接口封装或补 Mock 接口
- 把需求方案落成代码和文档
- 清理模板残留并完成业务化替换

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/README.md`
- relevant `docs/standards/*`
- `docs/templates/模板残留检查清单.md`
- `web/src/api/http.js`
- `web/src/api/modules.js`
- `mock-server/src/server.js`

Then inspect the nearest existing implementation under `web/src/views/`, `web/src/layout/`, or `web/src/components/`.

## Working Rules

- Treat the current repository as a real business project.
- Reuse the starter's stable layers first: `web/src/layout`, `web/src/router`, `web/src/styles/base.css`, `web/src/styles/admin.css`.
- Before editing, list the affected files and the docs that need sync.
- Update `README.md`, `docs/README.md`, `docs/tech/`, `docs/api/`, and `docs/qa/` in the same task when business wording or behavior changed.
- Do not leave mismatching template/demo wording in code comments, page copy, Mock data, or docs.
- Keep data fetching at the page layer and keep the API envelope consistent: `{ code, message, data }`.

## Implementation Workflow

1. Confirm the business scope and list affected files.
2. List the docs that must be synced before editing.
3. Find the closest existing page or endpoint and extend that pattern first.
4. Implement code, Mock, and doc changes in the same task.
5. Run the strongest validation the environment supports before finishing.

## Final Report

- 改动摘要
- 文档更新列表
- 模板残留检查结果
- 验证结果与未覆盖项
