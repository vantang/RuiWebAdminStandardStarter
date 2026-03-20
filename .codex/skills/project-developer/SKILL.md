---
name: project-developer
description: 在这个后台模板仓库里，当请求涉及前端页面、路由、样式、接口封装、Mock 服务、文档同步、模板残留清理或模板主干重构时使用此 skill。
---

# Project Developer

## Overview

Use this skill when Codex needs to implement or refactor work in this repository while staying inside the starter's existing structure. The focus is to make concrete changes in `web`, `mock-server`, and `docs` without eroding the template's stable layers or leaving stale template/demo wording in a business project.

## When To Use

Use this skill for requests such as:

- 新增或改造后台页面
- 调整 `router`、`layout`、`styles` 等模板骨架
- 新增接口封装或补 Mock 接口
- 把需求方案落成代码和文档
- 业务项目全仓业务化替换与模板残留清理
- 评估重构是否会破坏模板复用边界

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/README.md`
- `docs/standards/02-技术栈与目录规范.md`
- `docs/standards/03-设计系统与页面模式.md`
- `docs/standards/04-代码规范与协作约定.md`
- `docs/standards/05-文档规范与交付清单.md`
- `docs/standards/06-提交与分支规范.md`
- `docs/standards/07-AI协作与业务化替换规范.md`
- `docs/templates/模板残留检查清单.md`
- `docs/tech/后台模板技术方案.md`
- `web/src/api/http.js`
- `web/src/api/modules.js`
- `mock-server/src/server.js`
- `mock-server/src/data/demo.js`

Then inspect the nearest existing implementation under `web/src/views/`, `web/src/layout/`, or `web/src/components/`.

## Repository Rules

- First classify the repository identity: template maintenance or business project.
- Preserve the long-term stable layers first: `web/src/layout`, `web/src/router`, `web/src/styles/base.css`, `web/src/styles/admin.css`.
- Business-specific pages should prefer replacing examples under `web/src/views/examples` rather than reshaping the whole starter.
- Use `script setup` and Composition API in Vue files.
- Keep data fetching at the page layer. Pure display components should mostly receive props and emit events.
- Do not hardcode full API URLs in pages. Extend `web/src/api/modules.js` and keep `web/src/api/http.js` as the base wrapper.
- Keep Mock lightweight. Demo logic belongs in `mock-server`, but heavy business rules do not.
- Return or preserve the standard API envelope: `{ code, message, data }`.
- If the current repository is a business project, update mismatching template/demo wording in the same task instead of deferring it.
- Before editing, list the docs that need sync, especially `README.md`, `docs/README.md`, `docs/tech/`, `docs/api/`, and `docs/qa/`.
- If a template-mainline behavior changes, update the relevant files in `docs/standards/` or `docs/api/`.

## Change Mapping

Use these defaults unless the repo already suggests a better match:

- New page: `web/src/views/` plus `web/src/router/index.js`
- Shared navigation or shell change: `web/src/layout/AdminLayout.vue`
- Shared styling change: `web/src/styles/base.css` or `web/src/styles/admin.css`
- API wrapper and modules: `web/src/api/http.js` and `web/src/api/modules.js`
- Mock endpoints and demo data: `mock-server/src/server.js` and `mock-server/src/data/demo.js`
- Docs sync: `README.md`, `docs/README.md`, `docs/standards/`, `docs/api/`, `docs/tech/`, or `docs/qa/`

## Implementation Workflow

1. Confirm whether the request changes the template foundation or only example/business layers.
2. List affected files and the docs that must be synced before editing.
3. Find the closest existing page or endpoint and extend that pattern first.
4. Keep file responsibilities narrow. Avoid mixing layout, async orchestration, and presentation-heavy logic in one file if the change is growing.
5. Make the doc update in the same task when a repo rule, API shape, reusable pattern, or business wording changed.
6. Run the strongest validation the environment supports before finishing.

## Final Report

When the task is complete, include:

- 改动摘要
- 文档更新列表
- 模板残留检查结果
- 验证结果与未覆盖项

## Validation Baseline

Prefer these commands:

- `npm run check:strict`
- `npm --prefix web run dev`
- `npm --prefix mock-server run dev`
- `rg -n "通用后台 DEMO|模板工程|示例页面" README.md docs web mock-server`

If you cannot run validation, say exactly what was not run and why.

## Good Requests

- `用 $project-developer 在这个模板里补一个新的列表页和详情抽屉`
- `按现有规范给 web 和 mock-server 各补一组接口与页面`
- `重构这个实现，但不要破坏模板主干的复用边界`
