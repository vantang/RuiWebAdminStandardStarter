<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Download, Plus, Refresh } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { customerApi, metaApi } from "@/api/modules";
import { formatCurrency } from "@/utils/format";
import InfoTile from "@/components/InfoTile.vue";

const loading = ref(false);
const detailLoading = ref(false);
const drawerVisible = ref(false);
const options = ref({
  statusOptions: [],
  ownerOptions: [],
});
const tableData = ref({
  list: [],
  total: 0,
  page: 1,
  pageSize: 8,
  statusSummary: [],
});
const detail = ref(null);
const selectedRows = ref([]);

const filters = reactive({
  keyword: "",
  status: "",
  owner: "",
  page: 1,
  pageSize: 8,
});

const selectedCount = computed(() => selectedRows.value.length);

async function loadOptions() {
  options.value = await metaApi.options();
}

async function loadList() {
  loading.value = true;
  try {
    tableData.value = await customerApi.list({ ...filters });
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  filters.page = 1;
  loadList();
}

function handleReset() {
  filters.keyword = "";
  filters.status = "";
  filters.owner = "";
  filters.page = 1;
  loadList();
}

function handleCurrentChange(page) {
  filters.page = page;
  loadList();
}

function handleSelectionChange(rows) {
  selectedRows.value = rows;
}

async function openDetail(row) {
  drawerVisible.value = true;
  detailLoading.value = true;
  try {
    detail.value = await customerApi.detail(row.id);
  } finally {
    detailLoading.value = false;
  }
}

function simulateAction(message) {
  ElMessage.success(message);
}

function statusTagType(status) {
  if (status === "active") {
    return "success";
  }
  if (status === "risk") {
    return "danger";
  }
  if (status === "paused") {
    return "info";
  }
  return "warning";
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadList()]);
});
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">列表页示例</h2>
        <div class="page-hero__subtitle">
          演示后台项目中最常见的列表结构：筛选、批量操作、表格、分页，以及右侧详情抽屉。
        </div>
      </div>
      <div class="soft-tag">建议新项目优先从这个页面模式开始扩展</div>
    </section>

    <div class="info-grid" style="margin-bottom: 18px">
      <InfoTile
        v-for="item in tableData.statusSummary"
        :key="item.title"
        :title="item.title"
        :value="String(item.value)"
        :description="item.description"
        :tone="item.tone"
      />
    </div>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">筛选条件</div>
            <div class="panel-title__desc">关键字、状态和负责人是后台列表页最常见的过滤项</div>
          </div>
        </div>
      </template>

      <el-form inline>
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" clearable placeholder="客户 / 公司 / 标签" style="width: 240px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" clearable placeholder="全部状态" style="width: 180px">
            <el-option
              v-for="item in options.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="filters.owner" clearable placeholder="全部负责人" style="width: 180px">
            <el-option v-for="item in options.ownerOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">客户列表</div>
            <div class="panel-title__desc">当前选中 {{ selectedCount }} 项，共 {{ tableData.total }} 条记录</div>
          </div>
          <div class="button-row">
            <el-button type="primary" :icon="Plus" @click="simulateAction('这里适合接入新建页或新建弹窗')"
              >新建</el-button
            >
            <el-button :icon="Refresh" @click="simulateAction('批量操作入口已预留，可接入状态流转')"
              >批量操作</el-button
            >
            <el-button
              type="success"
              plain
              :icon="Download"
              @click="simulateAction('导出入口已预留，可接入真实导出服务')"
            >
              导出
            </el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData.list" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="客户名称" min-width="140" />
        <el-table-column prop="company" label="所属公司" min-width="180" />
        <el-table-column prop="ownerName" label="负责人" min-width="120" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ row.statusLabel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planLabel" label="套餐" min-width="110" />
        <el-table-column label="合同金额" min-width="130">
          <template #default="{ row }">{{ formatCurrency(row.annualContract) }}</template>
        </el-table-column>
        <el-table-column label="健康度" min-width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.healthScore" :stroke-width="10" />
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveAt" label="最近活跃" min-width="140" />
        <el-table-column label="标签" min-width="180">
          <template #default="{ row }">
            <div class="tag-list">
              <el-tag v-for="tag in row.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">查看详情</el-button>
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

    <el-drawer v-model="drawerVisible" size="46%" destroy-on-close>
      <template #header>
        <div class="drawer-title">详情抽屉示例</div>
      </template>

      <div v-loading="detailLoading">
        <template v-if="detail">
          <div class="drawer-section">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="客户名称">{{ detail.name }}</el-descriptions-item>
              <el-descriptions-item label="所属公司">{{ detail.company }}</el-descriptions-item>
              <el-descriptions-item label="负责人">{{ detail.ownerName }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="statusTagType(detail.status)">{{ detail.statusLabel }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
              <el-descriptions-item label="电话">{{ detail.phone }}</el-descriptions-item>
              <el-descriptions-item label="下一步动作">{{ detail.nextAction }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="drawer-section">
            <div class="tag-list">
              <el-tag v-for="tag in detail.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
            </div>
          </div>

          <div class="drawer-section">
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
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #173254;
}

.timeline-note__title {
  font-weight: 700;
}

.timeline-note__desc {
  margin-top: 4px;
  color: #72849a;
  font-size: 13px;
}
</style>
