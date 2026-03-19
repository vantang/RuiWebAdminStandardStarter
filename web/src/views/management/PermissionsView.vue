<script setup>
import { onMounted, ref } from "vue";
import { permissionApi } from "@/api/modules";
import InfoTile from "@/components/InfoTile.vue";

const loading = ref(false);
const overview = ref(null);

async function loadOverview() {
  loading.value = true;
  try {
    overview.value = await permissionApi.overview();
  } finally {
    loading.value = false;
  }
}

onMounted(loadOverview);
</script>

<template>
  <div v-loading="loading" class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">权限页示例</h2>
        <div class="page-hero__subtitle">展示角色、菜单权限、动作权限和典型授权矩阵，是后台系统常见的管理页面。</div>
      </div>
      <div class="soft-tag">当前页面只有管理员账号可访问</div>
    </section>

    <div class="info-grid" style="margin-bottom: 18px">
      <InfoTile
        v-for="item in overview?.summary || []"
        :key="item.title"
        :title="item.title"
        :value="String(item.value)"
        :description="item.description"
        :tone="item.tone"
      />
    </div>

    <div class="content-grid">
      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">角色卡片</div>
                <div class="panel-title__desc">适合先给管理者一个角色层级总览</div>
              </div>
            </div>
          </template>

          <div class="role-grid">
            <div v-for="role in overview?.roles || []" :key="role.name" class="role-card">
              <div class="role-card__title">{{ role.name }}</div>
              <div class="role-card__meta">{{ role.memberCount }} 人 · {{ role.scope }}</div>
              <div class="role-card__desc">{{ role.description }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">授权矩阵</div>
                <div class="panel-title__desc">演示角色与页面访问能力的关系</div>
              </div>
            </div>
          </template>

          <el-table :data="overview?.matrix || []" stripe>
            <el-table-column prop="module" label="模块" min-width="160" />
            <el-table-column prop="admin" label="平台管理员" min-width="140" />
            <el-table-column prop="operator" label="运营管理员" min-width="140" />
            <el-table-column prop="viewer" label="只读访客" min-width="120" />
          </el-table>
        </el-card>
      </div>

      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">菜单权限</div>
                <div class="panel-title__desc">常见的页面级权限颗粒度</div>
              </div>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="item in overview?.menuPermissions || []"
              :key="item.code"
              type="primary"
              :timestamp="item.code"
            >
              <div class="timeline-note__title">{{ item.name }}</div>
              <div class="timeline-note__desc">{{ item.description }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">动作权限</div>
                <div class="panel-title__desc">适合表达编辑、导出、审批等按钮级权限</div>
              </div>
            </div>
          </template>

          <div class="tag-list">
            <el-tag v-for="item in overview?.actionPermissions || []" :key="item.code" effect="plain">
              {{ item.name }}
            </el-tag>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-grid {
  display: grid;
  gap: 14px;
}

.role-card {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(243, 246, 251, 0.92);
}

.role-card__title,
.timeline-note__title {
  font-weight: 700;
  color: #173254;
}

.role-card__meta {
  margin-top: 6px;
  font-size: 12px;
  color: #70829a;
}

.role-card__desc,
.timeline-note__desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #677b93;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
