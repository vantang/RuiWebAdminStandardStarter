<script setup>
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

function switchAccount() {
  authStore.logout();
  appStore.resetVisitedViews();
  router.push("/login");
}
</script>

<template>
  <div class="page-shell">
    <el-card class="panel-card">
      <el-result
        icon="warning"
        title="当前账号没有访问权限"
        :sub-title="route.query.from ? `你尝试访问的是：${route.query.from}` : '请切换账号或联系管理员开通权限。'"
      >
        <template #extra>
          <div class="button-row">
            <el-button type="primary" @click="router.push('/dashboard')">返回工作台</el-button>
            <el-button @click="switchAccount">切换账号</el-button>
          </div>
        </template>
      </el-result>
    </el-card>
  </div>
</template>
