<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { metaApi, userApi } from "@/api/modules";

const loading = ref(false);
const detailLoading = ref(false);
const drawerVisible = ref(false);
const detail = ref(null);
const options = ref({
  roleOptions: [],
  userStatusOptions: [],
});
const tableData = ref({
  list: [],
  total: 0,
  page: 1,
  pageSize: 8,
});

const filters = reactive({
  keyword: "",
  role: "",
  status: "",
  page: 1,
  pageSize: 8,
});

const onlineCount = computed(() => tableData.value.list.filter((item) => item.status === "active").length);

async function loadOptions() {
  options.value = await metaApi.options();
}

async function loadUsers() {
  loading.value = true;
  try {
    tableData.value = await userApi.list({ ...filters });
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  filters.page = 1;
  loadUsers();
}

function handleReset() {
  filters.keyword = "";
  filters.role = "";
  filters.status = "";
  filters.page = 1;
  loadUsers();
}

function handleCurrentChange(page) {
  filters.page = page;
  loadUsers();
}

async function openDetail(row) {
  drawerVisible.value = true;
  detailLoading.value = true;
  try {
    detail.value = await userApi.detail(row.id);
  } finally {
    detailLoading.value = false;
  }
}

function statusType(status) {
  if (status === "active") {
    return "success";
  }
  if (status === "locked") {
    return "danger";
  }
  return "warning";
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadUsers()]);
});
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">用户管理</h2>
        <div class="page-hero__subtitle">演示后台中高频出现的用户列表、状态、角色与数据权限范围查看方式。</div>
      </div>
      <div class="soft-tag">当前页适合替换成员工、账号、成员或租户用户管理</div>
    </section>

    <el-row :gutter="18">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card">
          <div class="panel-title__name">在线用户</div>
          <div class="info-number">{{ onlineCount }}</div>
          <div class="panel-title__desc">当前页可见记录中的活跃账号数量</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card">
          <div class="panel-title__name">角色类型</div>
          <div class="info-number">{{ options.roleOptions.length }}</div>
          <div class="panel-title__desc">从 Mock 元数据返回的角色选项总数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card">
          <div class="panel-title__name">总账号数</div>
          <div class="info-number">{{ tableData.total }}</div>
          <div class="panel-title__desc">适合替换为真实用户库的总量指标</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">筛选条件</div>
            <div class="panel-title__desc">支持关键字、角色和账号状态过滤</div>
          </div>
        </div>
      </template>

      <el-form inline>
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="姓名 / 邮箱 / 部门" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="filters.role" placeholder="全部角色" clearable style="width: 180px">
            <el-option v-for="item in options.roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 180px">
            <el-option
              v-for="item in options.userStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">账号列表</div>
            <div class="panel-title__desc">常见后台中的用户、成员、员工账号管理主表格</div>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData.list" stripe>
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="220" />
        <el-table-column prop="deptName" label="部门" min-width="140" />
        <el-table-column prop="roleLabel" label="角色" min-width="130" />
        <el-table-column label="状态" min-width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.statusLabel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dataScope" label="数据范围" min-width="160" />
        <el-table-column prop="lastLoginAt" label="最近登录" min-width="170" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="tableData.page"
          :page-size="tableData.pageSize"
          :total="tableData.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-drawer v-model="drawerVisible" size="42%" destroy-on-close>
      <template #header>
        <div class="panel-title__name">账号详情</div>
      </template>

      <div v-loading="detailLoading">
        <template v-if="detail">
          <div class="drawer-section">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="姓名">{{ detail.name }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
              <el-descriptions-item label="角色">{{ detail.roleLabel }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ detail.deptName }}</el-descriptions-item>
              <el-descriptions-item label="数据范围">{{ detail.dataScope }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="statusType(detail.status)">{{ detail.statusLabel }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="drawer-section">
            <div class="section-label">权限标签</div>
            <div class="tag-list">
              <el-tag v-for="tag in detail.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
            </div>
          </div>

          <div class="drawer-section">
            <div class="section-label">最近操作</div>
            <el-timeline>
              <el-timeline-item
                v-for="item in detail.activities"
                :key="`${item.time}-${item.title}`"
                :timestamp="item.time"
                type="primary"
              >
                <div class="timeline-note__title">{{ item.title }}</div>
                <div class="timeline-note__desc">{{ item.description }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.info-number {
  margin: 12px 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: #173254;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.section-label,
.timeline-note__title {
  font-weight: 700;
  color: #173254;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.timeline-note__desc {
  margin-top: 4px;
  color: #72849a;
  font-size: 13px;
}
</style>
