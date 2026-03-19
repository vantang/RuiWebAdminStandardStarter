# Mock Server

通用后台管理 DEMO 的独立 Mock API。

## 作用

- 支撑前端页面示例
- 演示前后端分离结构
- 作为真实后端接入前的接口占位层

## 已实现接口

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/customers`
- `GET /api/customers/:id`
- `GET /api/meta/options`
- `GET /api/users`
- `GET /api/users/:id`
- `GET /api/permissions/overview`
- `GET /api/settings/profile`
- `PUT /api/settings/profile`
- `GET /api/projects/featured`
- `POST /api/projects`

## 演示账号

- `admin / admin123`：平台管理员，可访问全部示例页面
- `operator / operator123`：运营管理员，无权限页访问权

## 启动

```bash
cd /path/to/RuiWebAdminStandardStarter/mock-server
npm install
npm run dev
```

说明：当前 Mock 服务无第三方运行时依赖，`npm install` 仅用于统一使用体验。
