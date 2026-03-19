<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const formRef = ref();
const saving = ref(false);
const form = reactive({
  currentPassword: "",
  nextPassword: "",
  confirmPassword: "",
});

const rules = {
  currentPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  nextPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 8, message: "新密码至少 8 位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      trigger: "blur",
      validator: (_rule, value, callback) => {
        if (value !== form.nextPassword) {
          callback(new Error("两次输入的新密码不一致"));
          return;
        }

        callback();
      },
    },
  ],
};

async function handleSubmit() {
  await formRef.value.validate();
  saving.value = true;

  try {
    ElMessage.success("密码已更新，演示环境中不会持久化到服务端。");
    formRef.value.resetFields();
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">修改密码</h2>
        <div class="page-hero__subtitle">集中处理当前账号的密码更新与基础安全建议。</div>
      </div>
      <div class="soft-tag">支持从右上角账号菜单直接进入</div>
    </section>

    <div class="content-grid password-grid">
      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">更新登录密码</div>
              <div class="panel-title__desc">建议在高频环境中结合短信、邮箱或 MFA 再做二次确认</div>
            </div>
          </div>
        </template>

        <el-alert
          title="当前页面为模板演示页，密码变更结果只做前端反馈，不会写入 Mock 服务。"
          type="info"
          :closable="false"
          show-icon
        />

        <el-form ref="formRef" class="password-form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input v-model="form.currentPassword" type="password" show-password placeholder="请输入当前密码" />
          </el-form-item>

          <el-form-item label="新密码" prop="nextPassword">
            <el-input v-model="form.nextPassword" type="password" show-password placeholder="请输入新密码" />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>

          <div class="button-row">
            <el-button type="primary" :loading="saving" @click="handleSubmit">更新密码</el-button>
            <el-button @click="formRef.resetFields()">重置</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">安全建议</div>
              <div class="panel-title__desc">保留这类说明区块，能减少低质量密码与重复提交</div>
            </div>
          </div>
        </template>

        <div class="security-tips">
          <div class="security-tip">
            <div class="security-tip__title">密码长度</div>
            <div class="security-tip__desc">建议不少于 8 位，并混合字母、数字和特殊字符。</div>
          </div>
          <div class="security-tip">
            <div class="security-tip__title">定期轮换</div>
            <div class="security-tip__desc">高权限账号建议按季度轮换密码，并避免跨系统复用。</div>
          </div>
          <div class="security-tip">
            <div class="security-tip__title">异常提醒</div>
            <div class="security-tip__desc">密码修改后可追加设备下线、登录提醒或二次验证。</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.password-grid {
  align-items: start;
}

.password-form {
  margin-top: 20px;
}

.security-tips {
  display: grid;
  gap: 14px;
}

.security-tip {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(243, 246, 251, 0.92);
}

.security-tip__title {
  font-size: 14px;
  font-weight: 700;
  color: #173254;
}

.security-tip__desc {
  margin-top: 6px;
  font-size: 13px;
  color: #70829a;
}
</style>
