---
name: project-product-manager
description: 在这个后台模板仓库里，当请求涉及需求拆解、页面方案、API 草案、验收标准、交付文档，或判断需求应该落在模板主干还是业务层时使用此 skill。
---

# Project Product Manager

## Overview

Use this skill when Codex needs to turn a fuzzy backend-admin request into implementation-ready output for this repository. The goal is not generic PRD writing. The goal is to map a requirement onto this starter's page modes, mock API shape, documentation structure, and delivery constraints.

## When To Use

Use this skill for requests such as:

- 拆需求，明确范围内与范围外
- 产出页面方案、接口草案、字段清单、验收标准
- 判断一个想法应该进入模板主干还是业务替换层
- 为开发和测试补齐上下游依赖、风险、待确认项
- 需要把讨论结果沉淀为 `docs/` 下的结构化文档

## Context To Read First

Read only the files needed by the task:

- `docs/standards/01-项目定位与复用方式.md`
- `docs/standards/03-设计系统与页面模式.md`
- `docs/standards/05-文档规范与交付清单.md`
- `docs/templates/需求拆解模板.md`
- `docs/templates/页面方案模板.md`
- `docs/templates/API设计模板.md`
- `docs/api/通用后台Demo接口.md`

If the request targets an existing page or module, inspect the nearest match in `web/src/views/` and `web/src/api/modules.js` before proposing a new structure.

## Working Rules

- Treat this repo as a reusable admin foundation, not a single business system.
- Reuse the existing page modes before inventing a custom structure: dashboard, list, form, detail, docs.
- Clearly separate stable foundation changes from business-specific replacements.
- Use exact paths, route names, API paths, and field names whenever possible.
- Keep API drafts aligned with the repository response envelope: `{ code, message, data }`.
- If the proposal affects template conventions, call out which file under `docs/standards/` must be updated.
- Do not send developers or testers back into discovery if the requirement can already be clarified now.

## Default Output Shape

When the user asks for requirement analysis, produce the parts that matter for the request:

- 背景与目标
- 目标用户与核心场景
- 范围内与范围外
- 页面或模块拆解
- 受影响路径
- API 与 mock 依赖
- 字段与状态说明
- 验收标准
- 风险与待确认项

## Repository Mapping

Use these defaults unless the user asks otherwise:

- 需求拆解文档优先落到 `docs/tech/`
- 页面级方案优先参考 `docs/templates/页面方案模板.md`
- API 草案优先参考 `docs/templates/API设计模板.md`
- 如果是模板主干规则变化，同时更新相关 `docs/standards/*.md`

## Decision Heuristics

- If the change is about layout skeleton, shared styles, route organization, or reusable page modes, it is likely a template-mainline change.
- If the change is tied to a specific business noun, workflow, or one-off component, it likely belongs in the business replacement layer.
- If an existing example page can cover the interaction pattern, prefer replacing data and wording over inventing a new pattern.

## Good Requests

- `用 $project-product-manager 把“客户审批页”拆成页面方案、接口草案和验收标准`
- `评估这个需求应该放进模板主干还是业务层`
- `把这个后台需求整理成开发可执行的交付清单`
