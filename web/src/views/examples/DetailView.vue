<script setup>
import { computed, onMounted, ref } from "vue";
import { Calendar, Flag, User } from "@element-plus/icons-vue";
import { projectApi } from "@/api/modules";
import { formatCurrency, formatPercent } from "@/utils/format";
import InfoTile from "@/components/InfoTile.vue";

const loading = ref(false);
const detail = ref(null);
const activeTab = ref("milestones");

const budgetUsage = computed(() => {
  if (!detail.value?.budget) {
    return 0;
  }
  return Math.min(100, Number(((detail.value.spent / detail.value.budget) * 100).toFixed(1)));
});

const infoTiles = computed(() => {
  if (!detail.value) {
    return [];
  }

  return [
    {
      title: "当前进度",
      value: formatPercent(detail.value.progress),
      description: "详情页通常需要把进度和阶段显式展示出来",
      tone: "brand",
    },
    {
      title: "预算使用",
      value: formatCurrency(detail.value.spent),
      description: `预算总额 ${formatCurrency(detail.value.budget)}`,
      tone: "warning",
    },
    {
      title: "风险数量",
      value: String(detail.value.riskCount),
      description: "建议在详情页放置风险和异常收敛入口",
      tone: "danger",
    },
    {
      title: "协作成员",
      value: String(detail.value.members.length),
      description: "成员、角色和投入比是常见的二级详情信息",
      tone: "success",
    },
  ];
});

async function loadDetail() {
  loading.value = true;
  try {
    detail.value = await projectApi.featured();
  } finally {
    loading.value = false;
  }
}

function milestoneStatus(status) {
  if (status === "done") {
    return "success";
  }
  if (status === "current") {
    return "warning";
  }
  return "info";
}

onMounted(loadDetail);
</script>

<template>
  <div v-loading="loading" class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">详情页示例</h2>
        <div class="page-hero__subtitle">
          适合演示摘要信息、进度、团队成员、活动记录和附件，构成标准后台详情页模板。
        </div>
      </div>
      <div class="button-row">
        <el-button type="primary">编辑项目</el-button>
        <el-button>流转状态</el-button>
      </div>
    </section>

    <template v-if="detail">
      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">{{ detail.name }}</div>
              <div class="panel-title__desc">
                {{ detail.code }} · {{ detail.customerName }} · {{ detail.ownerName }}
              </div>
            </div>
            <div class="button-row">
              <el-tag type="success">{{ detail.statusLabel }}</el-tag>
              <el-tag effect="plain">{{ detail.stageLabel }}</el-tag>
            </div>
          </div>
        </template>

        <div class="detail-summary">
          <div class="detail-summary__main">
            <div class="detail-summary__desc">{{ detail.description }}</div>
            <div class="detail-summary__meta">
              <div>
                <el-icon><Calendar /></el-icon> 启动日期：{{ detail.startDate }}
              </div>
              <div>
                <el-icon><Flag /></el-icon> 计划交付：{{ detail.deliveryDate }}
              </div>
              <div>
                <el-icon><User /></el-icon> 项目负责人：{{ detail.ownerName }}
              </div>
            </div>
          </div>
          <div class="detail-summary__side">
            <el-progress type="dashboard" :percentage="detail.progress" />
          </div>
        </div>
      </el-card>

      <div class="info-grid" style="margin-bottom: 18px">
        <InfoTile
          v-for="item in infoTiles"
          :key="item.title"
          :title="item.title"
          :value="item.value"
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
                  <div class="panel-title__name">项目概览</div>
                  <div class="panel-title__desc">详情页中适合用描述列表承载基础字段</div>
                </div>
              </div>
            </template>

            <el-descriptions :column="2" border>
              <el-descriptions-item label="项目编号">{{ detail.code }}</el-descriptions-item>
              <el-descriptions-item label="客户">{{ detail.customerName }}</el-descriptions-item>
              <el-descriptions-item label="负责人">{{ detail.ownerName }}</el-descriptions-item>
              <el-descriptions-item label="执行阶段">{{ detail.stageLabel }}</el-descriptions-item>
              <el-descriptions-item label="开始日期">{{ detail.startDate }}</el-descriptions-item>
              <el-descriptions-item label="计划交付">{{ detail.deliveryDate }}</el-descriptions-item>
              <el-descriptions-item label="预算">{{ formatCurrency(detail.budget) }}</el-descriptions-item>
              <el-descriptions-item label="已使用预算">{{ formatCurrency(detail.spent) }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="panel-card">
            <template #header>
              <div class="panel-title">
                <div>
                  <div class="panel-title__name">执行明细</div>
                  <div class="panel-title__desc">推荐使用 Tabs 容纳里程碑、日志和附件</div>
                </div>
              </div>
            </template>

            <el-tabs v-model="activeTab">
              <el-tab-pane label="里程碑" name="milestones">
                <el-steps :active="detail.activeStep" finish-status="success">
                  <el-step
                    v-for="item in detail.milestones"
                    :key="item.title"
                    :title="item.title"
                    :description="item.date"
                  />
                </el-steps>

                <div class="milestone-list">
                  <div v-for="item in detail.milestones" :key="item.title" class="milestone-list__item">
                    <div>
                      <div class="milestone-list__title">{{ item.title }}</div>
                      <div class="milestone-list__meta">{{ item.date }}</div>
                    </div>
                    <el-tag :type="milestoneStatus(item.status)">{{ item.statusLabel }}</el-tag>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="活动记录" name="activities">
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
              </el-tab-pane>

              <el-tab-pane label="附件" name="attachments">
                <el-table :data="detail.attachments" stripe>
                  <el-table-column prop="name" label="文件名" min-width="180" />
                  <el-table-column prop="size" label="大小" min-width="120" />
                  <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
                  <el-table-column label="操作" width="110">
                    <template #default>
                      <el-button link type="primary">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>

        <div class="section-stack">
          <el-card class="panel-card">
            <template #header>
              <div class="panel-title">
                <div>
                  <div class="panel-title__name">预算与风险</div>
                  <div class="panel-title__desc">适合用卡片和 Alert 收纳关键状态</div>
                </div>
              </div>
            </template>

            <div class="section-stack">
              <div>
                <div class="info-muted">预算使用率</div>
                <el-progress :percentage="budgetUsage" :stroke-width="12" />
              </div>

              <el-alert
                title="当前项目存在 2 个待确认依赖"
                type="warning"
                :closable="false"
                description="适合在详情页右侧用 Alert 呈现项目风险、审批卡点和环境依赖。"
                show-icon
              />
            </div>
          </el-card>

          <el-card class="panel-card">
            <template #header>
              <div class="panel-title">
                <div>
                  <div class="panel-title__name">团队成员</div>
                  <div class="panel-title__desc">适合展示角色、投入比例和当前状态</div>
                </div>
              </div>
            </template>

            <div class="member-list">
              <div v-for="member in detail.members" :key="member.name" class="member-list__item">
                <div>
                  <div class="member-list__title">{{ member.name }}</div>
                  <div class="member-list__meta">{{ member.role }} · 投入 {{ member.allocation }}</div>
                </div>
                <el-tag type="success">{{ member.statusLabel }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.detail-summary__main {
  flex: 1;
}

.detail-summary__desc {
  line-height: 1.8;
  color: #4e6178;
}

.detail-summary__meta {
  display: flex;
  gap: 18px;
  margin-top: 16px;
  flex-wrap: wrap;
  color: #60738b;
  font-size: 13px;
}

.detail-summary__meta > div {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.milestone-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.milestone-list__item,
.member-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(243, 246, 251, 0.92);
}

.milestone-list__title,
.member-list__title,
.timeline-note__title {
  font-weight: 700;
  color: #1a304b;
}

.milestone-list__meta,
.member-list__meta,
.timeline-note__desc {
  margin-top: 4px;
  color: #72849a;
  font-size: 13px;
}

.member-list {
  display: grid;
  gap: 12px;
}

@media (max-width: 960px) {
  .detail-summary {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
