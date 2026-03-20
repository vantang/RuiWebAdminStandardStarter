---
name: project-tester
description: 在业务项目仓库里，当请求涉及测试方案、回归范围、文档一致性或模板残留检查时使用此 skill。
---

# Project Tester

## Overview

Use this skill when Codex needs to validate a change in the current business project. The focus is business-facing QA: user flows, API behavior, documentation consistency, and whether inherited template/demo wording has been fully removed.

## When To Use

Use this skill for requests such as:

- 为需求或改动设计测试点与回归范围
- 输出验收清单、冒烟清单、发布前检查项
- 验证 README、`docs/tech`、`docs/api` 是否与代码一致
- 检查业务项目中是否还残留模板/demo 叙述
- 对页面交互、表单、详情页和接口改动做质量评估

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/README.md`
- relevant `docs/standards/*`
- `docs/templates/测试验证模板.md`
- `docs/templates/业务项目测试验收模板.md`
- `docs/templates/模板残留检查清单.md`
- `.github/pull_request_template.md`

Then inspect the affected files under `web/` and `mock-server/`.

## Validation Workflow

1. Classify the change: docs-only, frontend UI, mock/API, shared layout, or mixed.
2. First confirm the `docs/qa/` acceptance artifact to update; treat it as a required deliverable for the business project.
3. Map the change to affected docs, user flows, and API paths.
4. Run or define smoke checks before deeper business validation.
5. Search for template residue when business wording changed.
6. Define automated checks first, then the minimal manual flows that still cover the risky paths.
7. End with residual risk, unexecuted checks, and an explicit acceptance recommendation.

## Default Output Shape

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

Use `docs/templates/业务项目测试验收模板.md` when the user wants a reusable acceptance artifact for the business project.
When severity labels are needed, use the shared `P0 / P1 / P2 / P3` definitions from `docs/standards/05-文档规范与交付清单.md`.
