# Web Frontend

通用后台管理前端 DEMO，负责展示后台模板的布局、页面模式与常见交互。

## 技术栈

- Vue 3
- Vite
- Element Plus
- Apache ECharts
- Vue Router
- Pinia

## 页面入口

- `/dashboard` 工作台
- `/examples/list` 列表页示例
- `/examples/form` 表单页示例
- `/examples/detail` 详情页示例
- `/examples/components` 组件页示例
- `/examples/visualization` 数据可视化页示例
- `/docs/guide` 文档与规范中心

## 使用原则

- `layout/` 保留后台主框架
- `styles/` 保留视觉变量和通用页面模式
- `views/examples/` 作为新项目替换入口
- `api/` 保留接口封装方式，按真实业务模块重组

## 启动

```bash
cd /path/to/RuiWebAdminStandardStarter/web
npm install
npm run dev
```

开发服务器默认监听 `0.0.0.0:5173`。
