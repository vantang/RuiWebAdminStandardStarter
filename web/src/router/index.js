import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layout/AdminLayout.vue";
import { pinia } from "@/stores";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guestOnly: true, title: "登录", subtitle: "通过基础权限壳进入睿境管理后台标准底座" },
  },
  {
    path: "/403",
    name: "forbidden",
    component: () => import("@/views/system/ForbiddenView.vue"),
    meta: { requiresAuth: true, title: "无权限访问", subtitle: "当前账号没有访问该页面的权限" },
  },
  {
    path: "/",
    component: AdminLayout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/OverviewView.vue"),
        meta: {
          affix: true,
          requiresAuth: true,
          permission: "dashboard.view",
          title: "工作台",
          subtitle: "标准后台模板的总览入口与复用建议",
        },
      },
      {
        path: "/account/profile",
        name: "account-profile",
        component: () => import("@/views/account/ProfileView.vue"),
        meta: {
          requiresAuth: true,
          title: "个人中心",
          subtitle: "查看当前账号信息、权限范围与工作区归属",
        },
      },
      {
        path: "/account/password",
        name: "account-password",
        component: () => import("@/views/account/PasswordView.vue"),
        meta: {
          requiresAuth: true,
          title: "修改密码",
          subtitle: "维护当前账号密码与登录安全策略",
        },
      },
      {
        path: "/examples/list",
        name: "example-list",
        component: () => import("@/views/examples/ListView.vue"),
        meta: {
          requiresAuth: true,
          permission: "examples.view",
          title: "列表页示例",
          subtitle: "筛选、批量操作、表格和抽屉详情",
        },
      },
      {
        path: "/examples/form",
        name: "example-form",
        component: () => import("@/views/examples/FormView.vue"),
        meta: {
          requiresAuth: true,
          permission: "examples.view",
          title: "表单页示例",
          subtitle: "常见输入控件、分组表单与提交反馈",
        },
      },
      {
        path: "/examples/detail",
        name: "example-detail",
        component: () => import("@/views/examples/DetailView.vue"),
        meta: {
          requiresAuth: true,
          permission: "examples.view",
          title: "详情页示例",
          subtitle: "摘要、明细、团队成员与执行记录",
        },
      },
      {
        path: "/examples/components",
        name: "example-components",
        component: () => import("@/views/examples/ComponentsView.vue"),
        meta: {
          requiresAuth: true,
          permission: "examples.view",
          title: "组件页示例",
          subtitle: "集中查看常见控件和反馈组件效果",
        },
      },
      {
        path: "/management/users",
        name: "management-users",
        component: () => import("@/views/management/UsersView.vue"),
        meta: {
          requiresAuth: true,
          permission: "users.read",
          title: "用户管理",
          subtitle: "常见后台中的用户列表、状态和权限范围管理",
        },
      },
      {
        path: "/management/permissions",
        name: "management-permissions",
        component: () => import("@/views/management/PermissionsView.vue"),
        meta: {
          requiresAuth: true,
          permission: "permissions.manage",
          title: "权限页示例",
          subtitle: "角色、菜单权限、动作权限和授权矩阵示例",
        },
      },
      {
        path: "/management/settings",
        name: "management-settings",
        component: () => import("@/views/management/SettingsView.vue"),
        meta: {
          requiresAuth: true,
          permission: "settings.manage",
          title: "设置页示例",
          subtitle: "工作区配置、通知策略和安全设置示例",
        },
      },
      {
        path: "/docs/guide",
        name: "docs-guide",
        component: () => import("@/views/docs/GuideView.vue"),
        meta: {
          requiresAuth: true,
          permission: "docs.view",
          title: "文档与规范中心",
          subtitle: "模板约定、技术方案与复用边界",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia);

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { path: "/dashboard" };
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    return { path: "/403", query: { from: to.fullPath } };
  }

  return true;
});

export default router;
