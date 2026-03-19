# Changelog

本文件记录 `睿境管理后台标准底座` 的主干演进。

格式参考 Keep a Changelog 的思路，但内容以当前仓库的模板演进为主，不强制绑定语义化版本发布节奏。

## [Unreleased]

### Added

- 补充 `Apache-2.0` 根许可证文件与开源协作说明
- 增加 `CODE_OF_CONDUCT.md`、`SECURITY.md`、`CONTRIBUTING.md`
- 增加 GitHub Issue / PR 模板，便于公开协作收敛信息质量
- 前端补充登录页、用户管理、权限页、设置页、403 页面
- 主框架补充可关闭书签页签，支持多页面切换

### Changed

- 将仓库主干重构为可复用后台标准底座，不再承载具体业务
- 统一品牌名称为 `睿境管理后台标准底座 / RUI Open-Ready Admin Foundation`
- 收口技术、设计、代码与文档规范到 `docs/standards`
- 登录页、顶部用户区、布局文案和视觉留白做了统一修整
- 前端构建改为更稳的按需注册与分 chunk 策略，消除大 chunk warning

### Removed

- 删除不再需要的 `docs/archive` 历史业务归档目录，避免模板仓库继续承载遗留案例
