# 通用后台 DEMO 接口说明

## 1. 接口总览

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 服务健康检查 |
| POST | `/api/auth/login` | 登录演示，返回 token、当前用户和权限集 |
| GET | `/api/dashboard/summary` | 工作台指标、任务和活动流 |
| GET | `/api/customers` | 列表页数据，支持筛选和分页 |
| GET | `/api/customers/:id` | 列表详情抽屉数据 |
| GET | `/api/meta/options` | 表单和筛选项元数据 |
| GET | `/api/users` | 用户管理列表示例，支持筛选和分页 |
| GET | `/api/users/:id` | 用户管理详情抽屉数据 |
| GET | `/api/permissions/overview` | 权限页示例数据 |
| GET | `/api/settings/profile` | 设置页初始化数据 |
| PUT | `/api/settings/profile` | 设置页保存示例 |
| GET | `/api/projects/featured` | 详情页演示数据 |
| POST | `/api/projects` | 表单提交示例 |

## 2. 响应结构

所有接口统一返回：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 3. 登录与权限壳

`POST /api/auth/login`

用途：

- 演示登录页、路由守卫和基础权限壳
- 返回 `token`、`user`、`permissions`
- 当前内置两个演示账号：`admin / admin123`、`operator / operator123`

权限数据会直接影响前端菜单显隐和页面访问控制。

## 4. 列表接口约定

`GET /api/customers`

支持参数：

- `keyword`
- `status`
- `owner`
- `page`
- `pageSize`

返回：

- `list`
- `page`
- `pageSize`
- `total`
- `statusSummary`

`GET /api/users`

支持参数：

- `keyword`
- `role`
- `status`
- `page`
- `pageSize`

返回：

- `list`
- `page`
- `pageSize`
- `total`

## 5. 管理页接口约定

`GET /api/permissions/overview`

返回：

- `summary`
- `roles`
- `matrix`
- `menuPermissions`
- `actionPermissions`

`GET /api/settings/profile`

返回：

- `workspaceName`
- `timezone`
- `locale`
- `loginReminder`
- `weeklyDigest`
- `releaseNotice`
- `approvalRequired`
- `ipWhitelist`

`PUT /api/settings/profile`

用途：

- 演示设置页保存动作
- Mock 层会直接回写内存中的配置对象

## 6. 表单接口约定

`POST /api/projects`

用途：

- 演示提交按钮、表单校验、成功反馈
- 不追求真实持久化，只返回回显结果

## 7. 使用建议

- 新项目中保留接口形态，不必保留字段名
- 页面完成前用 Mock 保证前端可以独立推进
- 真实后端接入时优先保持路径和响应结构稳定
