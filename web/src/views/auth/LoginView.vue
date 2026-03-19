<script setup>
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { brand } from "@/config/brand";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const loading = ref(false);

const accounts = [
  {
    username: "admin",
    password: "admin123",
    role: "平台管理员",
    desc: "可访问所有示例页面，包括权限页。",
  },
  {
    username: "operator",
    password: "operator123",
    role: "运营管理员",
    desc: "可访问工作台、用户管理、设置页，但无权限页访问权。",
  },
];

const form = reactive({
  username: "admin",
  password: "admin123",
});

const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

function useAccount(account) {
  form.username = account.username;
  form.password = account.password;
}

async function handleLogin() {
  await formRef.value.validate();
  loading.value = true;

  try {
    await authStore.login({ ...form });
    loading.value = false;
    ElMessage.success("登录成功");
    router.push(String(route.query.redirect || "/dashboard"));
  } catch (error) {
    loading.value = false;
    await ElMessageBox.alert(error.message || "账号或密码错误，请重新输入。", "登录失败", {
      type: "error",
      confirmButtonText: "重新输入",
    });
  }
}

async function showForgotPassword() {
  await ElMessageBox.alert(
    "当前是模板演示环境，请直接使用示例账号登录。接入真实认证系统后，可将这里替换为找回密码、短信验证或单点登录流程。",
    "忘记密码",
    {
      confirmButtonText: "知道了",
    },
  );
}
</script>

<template>
  <div class="login-shell">
    <div class="login-shell__inner">
      <div class="login-shell__hero">
        <div class="login-brand">{{ brand.loginBadgeLabel }}</div>
        <h1 class="login-title">{{ brand.loginHeroTitle }}</h1>
        <p class="login-subtitle">{{ brand.loginHeroSubtitle }}</p>

        <div class="login-highlights">
          <div class="login-highlight">
            <div class="login-highlight__title">页面模式</div>
            <div class="login-highlight__desc">工作台、列表页、表单页、详情页、设置页</div>
          </div>
          <div class="login-highlight">
            <div class="login-highlight__title">基础能力</div>
            <div class="login-highlight__desc">登录、路由守卫、权限页、Mock API、严格校验</div>
          </div>
        </div>
      </div>

      <div class="login-shell__panel">
        <el-card class="login-card">
          <template #header>
            <div>
              <div class="login-card__title">{{ brand.loginPanelTitle }}</div>
              <div class="login-card__desc">{{ brand.loginPanelSubtitle }}</div>
            </div>
          </template>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
            <el-form-item label="账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="请输入密码"
                @keydown.enter="handleLogin"
              />
            </el-form-item>
            <div class="login-card__actions">
              <el-button type="primary" :loading="loading" style="width: 100%" @click="handleLogin">
                登录并进入演示
              </el-button>
              <el-button link class="login-card__forgot" @click="showForgotPassword">忘记密码</el-button>
            </div>
          </el-form>

          <div class="login-card__hint">演示环境默认关闭注册入口，建议后续接入你自己的认证系统。</div>

          <div class="demo-account-list">
            <div v-for="account in accounts" :key="account.username" class="demo-account">
              <div>
                <div class="demo-account__title">{{ account.username }} / {{ account.password }}</div>
                <div class="demo-account__meta">{{ account.role }} · {{ account.desc }}</div>
              </div>
              <el-button plain @click="useAccount(account)">填入</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px clamp(32px, 5vw, 84px);
  background:
    radial-gradient(circle at top left, rgba(31, 111, 235, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(22, 163, 74, 0.1), transparent 22%), #eef4fb;
}

.login-shell__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(440px, 520px);
  gap: clamp(48px, 5vw, 88px);
  align-items: center;
  width: min(100%, 1440px);
}

.login-shell__hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 640px;
  margin: 0 auto;
}

.login-brand {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  color: #1557b0;
  background: rgba(31, 111, 235, 0.08);
  font-size: 13px;
  font-weight: 700;
}

.login-title {
  max-width: 620px;
  margin: 22px 0 0;
  font-size: 42px;
  line-height: 1.18;
  color: #153253;
}

.login-subtitle {
  max-width: 580px;
  margin-top: 18px;
  line-height: 1.8;
  color: #5e7188;
  font-size: 15px;
}

.login-highlights {
  display: grid;
  gap: 16px;
  max-width: 520px;
  margin-top: 28px;
}

.login-highlight {
  padding: 18px 20px;
  border: 1px solid rgba(15, 39, 70, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 12px 30px rgba(19, 47, 89, 0.06);
}

.login-highlight__title {
  font-size: 14px;
  font-weight: 700;
  color: #173254;
}

.login-highlight__desc {
  margin-top: 8px;
  color: #6d8098;
  font-size: 13px;
}

.login-shell__panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(19, 47, 89, 0.08);
}

.login-card__title {
  font-size: 22px;
  font-weight: 700;
  color: #173254;
}

.login-card__desc {
  margin-top: 6px;
  color: #70829a;
  font-size: 13px;
}

.login-card__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.login-card__forgot {
  align-self: flex-end;
  padding-right: 0;
  color: #5d7591;
}

.login-card__hint {
  margin-top: 8px;
  color: #7a8da3;
  font-size: 12px;
  line-height: 1.6;
}

.demo-account-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.demo-account {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(243, 246, 251, 0.92);
}

.demo-account__title {
  font-size: 13px;
  font-weight: 700;
  color: #173254;
}

.demo-account__meta {
  margin-top: 6px;
  color: #70829a;
  font-size: 12px;
}

@media (max-width: 1080px) {
  .login-shell__inner {
    grid-template-columns: 1fr;
  }

  .login-shell__hero {
    margin: 0;
  }
}

@media (max-width: 768px) {
  .login-shell {
    padding: 24px 18px;
  }

  .login-title {
    font-size: 32px;
  }

  .demo-account {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
