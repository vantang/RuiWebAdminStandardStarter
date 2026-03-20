---
name: project-tester
description: 在这个后台模板仓库里，当请求涉及测试方案、回归范围、验收检查、质量评估、文档一致性或模板残留检查时使用此 skill。
---

# Project Tester

## Overview

Use this skill when Codex needs to turn a change request or a code diff into a concrete validation plan for this repository. The focus is repository-specific QA: what to check, how to check it, which regressions matter, and how to report release readiness clearly, including business-doc consistency and template-residue checks.

## When To Use

Use this skill for requests such as:

- 为需求或改动设计测试点与回归范围
- 输出验收清单、冒烟清单、发布前检查项
- 根据代码改动补充负例、边界条件和风险提示
- 执行或解释 `npm run check:strict`
- 验证 README、`docs/tech`、`docs/api` 是否与代码一致
- 检查业务项目里是否还残留模板/demo 叙述
- 对列表页、表单页、详情页、权限壳等后台常见模式做质量评估

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/README.md`
- `docs/standards/03-设计系统与页面模式.md`
- `docs/standards/04-代码规范与协作约定.md`
- `docs/standards/05-文档规范与交付清单.md`
- `docs/standards/07-AI协作与业务化替换规范.md`
- `docs/templates/测试验证模板.md`
- `docs/templates/业务项目测试验收模板.md`
- `docs/templates/模板残留检查清单.md`
- `docs/api/通用后台Demo接口.md`
- `.github/pull_request_template.md`

Then inspect the affected files under `web/` and `mock-server/`.

## Repository-Specific Checks

Include the checks that fit the change:

- README、`docs/tech`、`docs/api` 与当前实现是否一致
- 业务项目内是否还残留模板/demo 叙述
- 登录与权限壳：`admin / admin123`、`operator / operator123`
- 路由守卫与 `403` 页面
- 列表页：筛选、分页、详情抽屉、空状态
- 表单页：校验、提交、成功反馈、失败反馈
- 详情页：摘要、进度、时间线、附件等模块展示
- 设置页：读取配置、保存配置、提示反馈
- Mock API：状态码、统一响应结构、错误返回
- 响应式：`>=1200px`、`768px-1199px`、`<768px`

## Validation Workflow

1. Classify the change: docs-only, frontend UI, mock/API, shared layout, or mixed.
2. If the repository is a business project, first confirm the `docs/qa/` acceptance artifact to update; treat it as a required deliverable, not an optional appendix.
3. Map the change to affected docs, user flows, and API paths.
4. Run or define smoke checks before deeper business validation.
5. Define automated checks first, then the minimal manual flows that still cover the risky paths.
6. Add negative and boundary cases when forms, permissions, or filters are involved.
7. Search for template residue when business wording changed.
8. End with residual risk, unexecuted checks, and an explicit acceptance recommendation.

## Default Output Shape

When the user asks for a QA deliverable, produce the parts that matter:

- 测试范围
- 前置条件
- 测试阶段 / 执行顺序
- 核心用例
- 文档一致性检查
- 模板残留检查
- 回归清单
- 缺陷分级与问题清单
- 缺陷复测
- 执行结果
- 未覆盖项
- 风险与结论

Use `docs/templates/测试验证模板.md` for generic validation notes.
Use `docs/templates/业务项目测试验收模板.md` when the current repository is a business project and the user wants a reusable acceptance artifact.
When severity labels are needed, use the shared `P0 / P1 / P2 / P3` definitions from `docs/standards/05-文档规范与交付清单.md`.

## Validation Commands

Prefer these commands:

- `npm run check:strict`
- `npm --prefix mock-server run test:smoke`
- `npm --prefix web run build`
- `rg -n "通用后台 DEMO|模板工程|示例页面" README.md docs web mock-server`

If commands cannot run, say exactly what was blocked and keep the manual verification plan explicit.

## Good Requests

- `用 $project-tester 给这次页面改动出一份回归验证清单`
- `按这个仓库的实际页面模式补一份验收方案`
- `帮我验证这次改动还需要补哪些负例和边界场景`
