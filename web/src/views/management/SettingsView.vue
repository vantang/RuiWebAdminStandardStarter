<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { settingsApi } from "@/api/modules";
import { useAppStore } from "@/stores/app";

const formRef = ref();
const loading = ref(false);
const saving = ref(false);
const activeTab = ref("workspace");
const appStore = useAppStore();
const form = reactive({
  workspaceName: "",
  timezone: "",
  locale: "",
  loginReminder: true,
  weeklyDigest: true,
  releaseNotice: true,
  approvalRequired: true,
  ipWhitelist: "",
});

const rules = {
  workspaceName: [{ required: true, message: "请输入工作区名称", trigger: "blur" }],
  timezone: [{ required: true, message: "请选择时区", trigger: "change" }],
  locale: [{ required: true, message: "请选择语言", trigger: "change" }],
};

async function loadSettings() {
  loading.value = true;
  try {
    Object.assign(form, await settingsApi.detail());
    appStore.setWorkspaceName(form.workspaceName);
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  await formRef.value.validate();
  saving.value = true;
  try {
    await settingsApi.update({ ...form });
    appStore.setWorkspaceName(form.workspaceName);
    ElMessage.success("设置已保存");
  } finally {
    saving.value = false;
  }
}

onMounted(loadSettings);
</script>

<template>
  <div v-loading="loading" class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">设置页示例</h2>
        <div class="page-hero__subtitle">演示工作区设置、通知策略与安全项，是后台项目中非常常见的配置页面。</div>
      </div>
      <div class="soft-tag">适合扩展为系统设置、组织设置或租户级配置中心</div>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">配置中心</div>
            <div class="panel-title__desc">建议用 Tabs 组织不同类型的设置区块</div>
          </div>
          <el-button type="primary" :loading="saving" @click="handleSave">保存设置</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="工作区" name="workspace">
            <el-row :gutter="20">
              <el-col :xs="24" :lg="12">
                <el-form-item label="工作区名称" prop="workspaceName">
                  <el-input v-model="form.workspaceName" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :lg="6">
                <el-form-item label="时区" prop="timezone">
                  <el-select v-model="form.timezone" style="width: 100%">
                    <el-option label="Asia/Shanghai" value="Asia/Shanghai" />
                    <el-option label="UTC" value="UTC" />
                    <el-option label="America/Los_Angeles" value="America/Los_Angeles" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :lg="6">
                <el-form-item label="语言" prop="locale">
                  <el-select v-model="form.locale" style="width: 100%">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="通知策略" name="notify">
            <div class="settings-stack">
              <div class="settings-item">
                <div>
                  <div class="settings-item__title">登录提醒</div>
                  <div class="settings-item__desc">用户登录后向管理员发送安全提醒</div>
                </div>
                <el-switch v-model="form.loginReminder" />
              </div>
              <div class="settings-item">
                <div>
                  <div class="settings-item__title">周报摘要</div>
                  <div class="settings-item__desc">每周自动汇总工作台指标并发出摘要通知</div>
                </div>
                <el-switch v-model="form.weeklyDigest" />
              </div>
              <div class="settings-item">
                <div>
                  <div class="settings-item__title">版本发布通知</div>
                  <div class="settings-item__desc">发布新版本时通知相关负责人</div>
                </div>
                <el-switch v-model="form.releaseNotice" />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="安全设置" name="security">
            <div class="settings-stack">
              <div class="settings-item">
                <div>
                  <div class="settings-item__title">敏感操作审批</div>
                  <div class="settings-item__desc">高风险配置变更前必须经过审批确认</div>
                </div>
                <el-switch v-model="form.approvalRequired" />
              </div>
              <el-form-item label="IP 白名单">
                <el-input
                  v-model="form.ipWhitelist"
                  type="textarea"
                  :rows="4"
                  placeholder="多个 IP 段按逗号或换行分隔"
                />
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.settings-stack {
  display: grid;
  gap: 16px;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(243, 246, 251, 0.92);
}

.settings-item__title {
  font-size: 14px;
  font-weight: 700;
  color: #173254;
}

.settings-item__desc {
  margin-top: 6px;
  font-size: 13px;
  color: #70829a;
}
</style>
