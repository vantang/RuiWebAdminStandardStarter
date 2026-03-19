<script setup>
import { computed } from "vue";
import { brand } from "@/config/brand";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";

const appStore = useAppStore();
const authStore = useAuthStore();

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

const profileSummary = computed(() => [
  { label: "账号 ID", value: authStore.currentUser?.id || "-" },
  { label: "当前角色", value: authStore.currentUser?.role || "-" },
  { label: "权限数量", value: `${authStore.permissions.length} 项` },
  { label: "当前工作区", value: appStore.workspace.name || "-" },
  { label: "产品名称", value: brand.productNameZh },
  { label: "登录状态", value: authStore.isLoggedIn ? "已登录" : "未登录" },
]);
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">个人中心</h2>
        <div class="page-hero__subtitle">汇总当前登录账号的身份信息、权限范围和工作区上下文。</div>
      </div>
      <div class="soft-tag">右上角账号菜单统一进入这里</div>
    </section>

    <div class="content-grid profile-grid">
      <el-card class="panel-card profile-card">
        <div class="profile-card__head">
          <el-avatar class="profile-card__avatar" :size="72">{{ userAvatarText }}</el-avatar>
          <div>
            <div class="profile-card__name">{{ authStore.currentUser?.name || "-" }}</div>
            <div class="profile-card__role">{{ authStore.currentUser?.role || "-" }}</div>
          </div>
        </div>

        <div class="profile-card__metrics">
          <div class="profile-card__metric">
            <div class="profile-card__metric-value">{{ authStore.permissions.length }}</div>
            <div class="profile-card__metric-label">权限项</div>
          </div>
          <div class="profile-card__metric">
            <div class="profile-card__metric-value">{{ appStore.workspace.name }}</div>
            <div class="profile-card__metric-label">所在工作区</div>
          </div>
        </div>

        <div class="profile-card__note">
          当前账号已接入模板内的权限壳和页面访问控制，适合作为个人资料、偏好设置或账号安全中心的入口。
        </div>
      </el-card>

      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">账号概览</div>
                <div class="panel-title__desc">展示当前会话下最常用的身份与环境信息</div>
              </div>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item v-for="item in profileSummary" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">权限清单</div>
                <div class="panel-title__desc">用于快速确认当前账号可访问的模板能力范围</div>
              </div>
            </div>
          </template>

          <div class="permission-list">
            <el-tag v-for="permission in authStore.permissions" :key="permission" effect="plain" size="large">
              {{ permission }}
            </el-tag>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-grid {
  align-items: start;
}

.profile-card {
  height: 100%;
}

.profile-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-card__avatar {
  color: #ffffff;
  background: linear-gradient(135deg, #1f6feb, #0f4aa4);
  font-weight: 700;
}

.profile-card__name {
  font-size: 24px;
  font-weight: 700;
  color: #163254;
}

.profile-card__role {
  margin-top: 8px;
  font-size: 14px;
  color: #70829a;
}

.profile-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.profile-card__metric {
  padding: 16px;
  border-radius: 16px;
  background: rgba(243, 246, 251, 0.92);
}

.profile-card__metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #173254;
}

.profile-card__metric-label {
  margin-top: 6px;
  font-size: 12px;
  color: #70829a;
}

.profile-card__note {
  margin-top: 20px;
  padding: 16px 18px;
  border-radius: 16px;
  color: #4e6179;
  background: rgba(31, 111, 235, 0.08);
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 768px) {
  .profile-card__head {
    align-items: flex-start;
  }

  .profile-card__name {
    font-size: 20px;
  }

  .profile-card__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
