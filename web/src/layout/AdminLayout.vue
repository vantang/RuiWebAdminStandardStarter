<script setup>
import { computed, watch } from "vue";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowDown,
  Close,
  DataAnalysis,
  DocumentCopy,
  EditPen,
  Expand,
  Fold,
  Grid,
  HomeFilled,
  Key,
  List,
  Setting,
  SetUp,
  SwitchButton,
  UserFilled,
} from "@element-plus/icons-vue";
import { brand } from "@/config/brand";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();

const menuGroups = [
  {
    name: "总览",
    items: [{ index: "/dashboard", title: "工作台", icon: HomeFilled }],
  },
  {
    name: "页面示例",
    items: [
      { index: "/examples/list", title: "列表页示例", icon: List },
      { index: "/examples/form", title: "表单页示例", icon: EditPen },
      { index: "/examples/detail", title: "详情页示例", icon: Grid },
      { index: "/examples/components", title: "组件页示例", icon: SetUp },
    ],
  },
  {
    name: "管理模块",
    items: [
      { index: "/management/users", title: "用户管理", icon: UserFilled, permission: "users.read" },
      { index: "/management/permissions", title: "权限页示例", icon: Key, permission: "permissions.manage" },
      { index: "/management/settings", title: "设置页示例", icon: Setting, permission: "settings.manage" },
    ],
  },
  {
    name: "规范资产",
    items: [{ index: "/docs/guide", title: "文档与规范中心", icon: DocumentCopy, permission: "docs.view" }],
  },
];

const breadcrumbs = computed(() => route.matched.filter((item) => item.meta?.title).map((item) => item.meta.title));
const sidebarToggleIcon = computed(() => (appStore.sidebarCollapsed ? Expand : Fold));
const headerTitle = computed(() => route.meta?.title || brand.productNameZh);
const headerSubtitle = computed(() => route.meta?.subtitle || breadcrumbs.value.join(" / "));
const userAvatarText = computed(() => {
  const name = authStore.currentUser?.name?.trim() || "";

  if (!name) {
    return "R";
  }

  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(-2);
  }

  return name
    .split(/\s+/)
    .map((item) => item[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
const visibleMenuGroups = computed(() =>
  menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => authStore.hasPermission(item.permission)),
    }))
    .filter((group) => group.items.length > 0),
);

const userMenuActions = {
  profile: "/account/profile",
  password: "/account/password",
};

watch(
  () => route.fullPath,
  () => {
    appStore.visitView(route);
  },
  { immediate: true },
);

async function handleLogout() {
  try {
    await ElMessageBox.confirm("退出后将返回登录页。", "确认退出", {
      type: "warning",
      confirmButtonText: "退出登录",
      cancelButtonText: "取消",
    });
    authStore.logout();
    appStore.resetVisitedViews();
    router.push("/login");
  } catch {
    // Ignore cancel action.
  }
}

async function handleUserCommand(command) {
  if (command === "logout") {
    await handleLogout();
    return;
  }

  const targetPath = userMenuActions[command];

  if (targetPath && targetPath !== route.path) {
    router.push(targetPath);
  }
}

function openView(path) {
  if (path !== route.path) {
    router.push(path);
  }
}

function closeView(target) {
  if (target.affix) {
    return;
  }

  const currentIndex = appStore.visitedViews.findIndex((item) => item.path === target.path);
  const fallback = appStore.visitedViews[currentIndex + 1] ||
    appStore.visitedViews[currentIndex - 1] || {
      path: "/dashboard",
    };

  appStore.closeView(target.path);

  if (route.path === target.path) {
    router.push(fallback.path);
  }
}
</script>

<template>
  <el-container :class="['admin-layout', { 'is-sidebar-collapsed': appStore.sidebarCollapsed }]">
    <el-aside
      :width="appStore.sidebarCollapsed ? 'var(--layout-sidebar-collapsed)' : 'var(--layout-sidebar-expanded)'"
      class="admin-layout__aside"
    >
      <div class="brand-panel">
        <div class="brand-panel__logo">
          <el-icon size="20"><Grid /></el-icon>
        </div>
        <div v-if="!appStore.sidebarCollapsed" class="brand-panel__text">
          <div class="brand-panel__name">{{ brand.sidebarName }}</div>
          <div class="brand-panel__sub">{{ brand.taglineEn }}</div>
        </div>
      </div>

      <el-scrollbar>
        <div v-for="group in visibleMenuGroups" :key="group.name" class="nav-group">
          <div v-if="!appStore.sidebarCollapsed" class="nav-group__title">{{ group.name }}</div>
          <el-menu
            :default-active="route.path"
            class="nav-menu"
            :collapse="appStore.sidebarCollapsed"
            :collapse-transition="false"
            router
          >
            <el-menu-item v-for="item in group.items" :key="item.index" :index="item.index">
              <el-icon><component :is="item.icon" /></el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </el-menu>
        </div>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="admin-layout__header">
        <div class="header-left">
          <el-button
            circle
            plain
            :aria-label="appStore.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
            @click="appStore.toggleSidebar()"
          >
            <el-icon><component :is="sidebarToggleIcon" /></el-icon>
          </el-button>

          <div class="header-copy">
            <div class="header-title">{{ headerTitle }}</div>
            <div class="header-subtitle">{{ headerSubtitle }}</div>
          </div>
        </div>

        <div class="header-right">
          <div class="status-chip">
            <el-icon><DataAnalysis /></el-icon>
            <span class="status-chip__text">前端 DEMO / Mock API / 规范文档</span>
          </div>

          <div class="workspace-card">
            <div class="workspace-card__label">Workspace</div>
            <div class="workspace-card__value">{{ appStore.workspace.name }}</div>
          </div>

          <el-dropdown class="header-user" trigger="click" placement="bottom-end" @command="handleUserCommand">
            <button type="button" class="header-user__trigger" aria-label="打开账号菜单">
              <el-avatar class="header-user__avatar" :size="40">{{ userAvatarText }}</el-avatar>
              <div class="header-user__meta">
                <div class="header-user__name">{{ authStore.currentUser?.name || "-" }}</div>
                <div class="header-user__role">{{ authStore.currentUser?.role || "-" }}</div>
              </div>
              <el-icon class="header-user__caret"><ArrowDown /></el-icon>
            </button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <span class="header-user__menu-item">
                    <el-icon><UserFilled /></el-icon>
                    个人中心
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="password">
                  <span class="header-user__menu-item">
                    <el-icon><Key /></el-icon>
                    修改密码
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <span class="header-user__menu-item">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <div class="bookmark-bar">
        <div class="bookmark-bar__list">
          <button
            v-for="item in appStore.visitedViews"
            :key="item.path"
            type="button"
            :class="['bookmark-item', { 'is-active': item.path === route.path }]"
            @click="openView(item.path)"
          >
            <span class="bookmark-item__label">{{ item.title }}</span>
            <el-icon v-if="!item.affix" class="bookmark-item__close" @click.stop="closeView(item)">
              <Close />
            </el-icon>
          </button>
        </div>
      </div>

      <el-main class="admin-layout__main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  --layout-sidebar-expanded: 248px;
  --layout-sidebar-collapsed: 84px;
  --layout-header-padding-x: 24px;
  --layout-page-padding: 24px;
}

.admin-layout__aside {
  overflow: hidden;
  border-right: 1px solid rgba(15, 39, 70, 0.08);
  background: linear-gradient(180deg, rgba(12, 39, 79, 0.99), rgba(11, 55, 102, 0.97)), #0c274f;
  transition: width 0.24s ease;
}

.brand-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 14px;
  color: #ffffff;
}

.is-sidebar-collapsed .brand-panel {
  justify-content: center;
  padding-right: 0;
  padding-left: 0;
}

.brand-panel__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
}

.brand-panel__name {
  font-size: 15px;
  font-weight: 700;
}

.brand-panel__sub {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.66);
}

.nav-group {
  padding: 8px 10px 0;
}

.is-sidebar-collapsed .nav-group {
  padding-right: 8px;
  padding-left: 8px;
}

.nav-group__title {
  padding: 0 12px 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.52);
}

:deep(.nav-menu) {
  border-right: none;
  background: transparent;
}

:deep(.nav-menu .el-menu-item) {
  min-height: 44px;
  margin-bottom: 6px;
  border-radius: 12px;
  padding-right: 14px !important;
  padding-left: 14px !important;
  color: rgba(255, 255, 255, 0.8);
}

.is-sidebar-collapsed :deep(.nav-menu.el-menu--collapse) {
  width: 100%;
}

.is-sidebar-collapsed :deep(.nav-menu.el-menu--collapse .el-menu-item) {
  justify-content: center;
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.is-sidebar-collapsed :deep(.nav-menu.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}

:deep(.nav-menu .el-menu-item.is-active) {
  color: #ffffff;
  background: linear-gradient(90deg, rgba(76, 145, 255, 0.44), rgba(56, 126, 255, 0.24));
}

:deep(.nav-menu .el-menu-item:hover) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.admin-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 82px;
  padding: 0 var(--layout-header-padding-x);
  border-bottom: 1px solid rgba(15, 39, 70, 0.08);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.header-copy {
  min-width: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: #163254;
}

.header-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #70829a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  color: #1859b6;
  background: rgba(31, 111, 235, 0.08);
}

.status-chip__text {
  font-size: 13px;
  font-weight: 600;
}

.workspace-card {
  min-width: 154px;
  padding: 8px 12px;
  border: 1px solid rgba(15, 39, 70, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
}

.workspace-card__label {
  font-size: 11px;
  color: #7a8ca3;
}

.workspace-card__value {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #173254;
}

.header-user {
  min-width: 0;
}

.header-user__trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  max-width: 228px;
  padding: 10px 12px;
  border: none;
  border-radius: 16px;
  background: rgba(240, 245, 252, 0.94);
  box-shadow: inset 0 0 0 1px rgba(15, 39, 70, 0.05);
  color: inherit;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.header-user__trigger:hover {
  background: rgba(235, 242, 251, 0.98);
  box-shadow:
    inset 0 0 0 1px rgba(31, 111, 235, 0.08),
    0 10px 24px rgba(19, 47, 89, 0.08);
  transform: translateY(-1px);
}

.header-user__trigger:focus-visible {
  outline: 2px solid rgba(31, 111, 235, 0.28);
  outline-offset: 2px;
}

.header-user__avatar {
  color: #ffffff;
  background: linear-gradient(135deg, #1f6feb, #0f4aa4);
  font-weight: 700;
}

.header-user__meta {
  min-width: 0;
  flex: 1;
  text-align: left;
}

.header-user__name {
  font-size: 14px;
  font-weight: 700;
  color: #173254;
}

.header-user__role {
  margin-top: 4px;
  font-size: 12px;
  color: #70829a;
}

.header-user__caret {
  color: #35577c;
}

.header-user__menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.bookmark-bar {
  border-bottom: 1px solid rgba(15, 39, 70, 0.08);
  background: rgba(255, 255, 255, 0.8);
}

.bookmark-bar__list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 24px;
  scrollbar-width: thin;
}

.bookmark-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  max-width: 220px;
  padding: 9px 12px;
  border: 1px solid rgba(15, 39, 70, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #5f728a;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.bookmark-item:hover {
  color: #173254;
  border-color: rgba(31, 111, 235, 0.16);
  box-shadow: 0 10px 22px rgba(19, 47, 89, 0.06);
  transform: translateY(-1px);
}

.bookmark-item.is-active {
  border-color: rgba(31, 111, 235, 0.18);
  color: #1557b0;
  background: linear-gradient(135deg, rgba(31, 111, 235, 0.1), rgba(255, 255, 255, 0.98));
}

.bookmark-item__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bookmark-item__close {
  flex: 0 0 auto;
  border-radius: 999px;
  color: #8aa0b8;
}

.bookmark-item__close:hover {
  color: #173254;
}

.admin-layout__main {
  padding: 0;
  background: linear-gradient(180deg, #f5f8fc, #eef3f9);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.2s ease;
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 1200px) {
  .status-chip,
  .workspace-card {
    display: none;
  }

  .admin-layout__header {
    align-items: flex-start;
    min-height: auto;
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 960px) {
  .header-user__trigger {
    max-width: 200px;
  }

  .header-subtitle {
    max-width: 280px;
  }
}

@media (max-width: 768px) {
  .admin-layout__header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    justify-content: space-between;
  }

  .header-user__trigger {
    width: 100%;
    max-width: none;
  }

  .bookmark-bar__list {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
