---
name: project-tester
description: 在这个后台模板仓库里，当请求涉及测试方案、回归范围、验收检查、质量评估，或需要把改动映射到实际验证动作时使用此 skill。
---

# Project Tester

## Overview

Use this skill when Codex needs to turn a change request or a code diff into a concrete validation plan for this repository. The focus is repository-specific QA: what to check, how to check it, which regressions matter, and how to report release readiness clearly.

## When To Use

Use this skill for requests such as:

- 为需求或改动设计测试点与回归范围
- 输出验收清单、冒烟清单、发布前检查项
- 根据代码改动补充负例、边界条件和风险提示
- 执行或解释 `npm run check:strict`
- 对列表页、表单页、详情页、权限壳等后台常见模式做质量评估

## Context To Read First

Read only the files needed by the task:

- `README.md`
- `docs/standards/03-设计系统与页面模式.md`
- `docs/standards/04-代码规范与协作约定.md`
- `docs/standards/05-文档规范与交付清单.md`
- `docs/templates/测试验证模板.md`
- `docs/api/通用后台Demo接口.md`
- `.github/pull_request_template.md`

Then inspect the affected files under `web/` and `mock-server/`.

## Repository-Specific Checks

Include the checks that fit the change:

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
2. Map the change to affected user flows and API paths.
3. Define automated checks first, then the minimal manual flows that still cover the risky paths.
4. Add negative and boundary cases when forms, permissions, or filters are involved.
5. End with residual risk and any checks that were not executed.

## Default Output Shape

When the user asks for a QA deliverable, produce the parts that matter:

- 测试范围
- 前置条件
- 核心用例
- 回归清单
- 执行结果
- 未覆盖项
- 风险与结论

Use `docs/templates/测试验证模板.md` when the user wants a reusable test or acceptance artifact.

## Validation Commands

Prefer these commands:

- `npm run check:strict`
- `npm --prefix mock-server run test:smoke`
- `npm --prefix web run build`

If commands cannot run, say exactly what was blocked and keep the manual verification plan explicit.

## Good Requests

- `用 $project-tester 给这次页面改动出一份回归验证清单`
- `按这个仓库的实际页面模式补一份验收方案`
- `帮我验证这次改动还需要补哪些负例和边界场景`
