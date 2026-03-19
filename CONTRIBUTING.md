# Contributing

欢迎 Issue、PR、Fork，以及基于本仓库进行二次开发。

参与前建议先阅读：

- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `SUPPORT.md`
- `DISCUSSIONS.md`

## 开源许可与贡献授权

本仓库采用 `Apache-2.0` 许可证。

向本仓库提交代码、文档、配置或其他内容时，默认表示你同意这些贡献以同样的 `Apache-2.0` 许可证提供，不附加额外限制。

允许使用 AI 辅助生成或修改贡献内容，但提交者需要自行负责：

- 贡献内容的正确性、可维护性与安全性
- 贡献内容不侵犯第三方版权、专利、商标或其他权利
- 对 AI 生成结果进行必要的人工审查，而不是直接机械提交

## 提交前检查

在提交前执行：

```bash
cd /path/to/RuiWebAdminStandardStarter
npm run check:strict
```

## 提交建议

- 小步提交
- 先保证可运行，再提交
- 模板主干改动要同步更新 `docs/standards`
- 不要把历史业务案例重新混入模板主干
- 如果提交内容明显由 AI 辅助完成，建议在 PR 描述中说明使用方式与人工复核范围

## 提交信息

建议使用：

```text
<type>(<scope>): <summary>
```

可以先执行：

```bash
npm run git:use-template
```

这样 Git 会使用仓库内的 commit message 模板。
