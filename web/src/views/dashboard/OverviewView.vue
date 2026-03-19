<script setup>
import { onMounted, ref } from "vue";
import { Checked, Clock, DataLine, Files, Monitor, TrendCharts } from "@element-plus/icons-vue";
import { dashboardApi } from "@/api/modules";
import { formatCurrency, formatPercent } from "@/utils/format";
import { brand } from "@/config/brand";
import MetricCard from "@/components/MetricCard.vue";
import InfoTile from "@/components/InfoTile.vue";

const summary = ref(null);
const loading = ref(false);

async function loadSummary() {
  loading.value = true;
  try {
    summary.value = await dashboardApi.summary();
  } finally {
    loading.value = false;
  }
}

onMounted(loadSummary);
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">{{ brand.productNameZh }}</h2>
        <div class="page-hero__subtitle">
          以开源就绪的工程结构、页面范式和规范资产，为管理后台提供稳定、可复用的统一起点。
        </div>
      </div>
      <div class="soft-tag">
        <el-icon><Monitor /></el-icon>
        当前展示的是通用后台 DEMO，而不是具体业务系统
      </div>
    </section>

    <div v-loading="loading" class="metric-grid">
      <MetricCard
        title="活跃项目"
        :value="String(summary?.metrics.activeProjects || 0)"
        description="建议作为工作台首页固定展示指标"
        tag="Dashboard"
        tone="brand"
        trend="较上周新增 3 个项目"
        :icon="Files"
      />
      <MetricCard
        title="待处理审批"
        :value="String(summary?.metrics.pendingApprovals || 0)"
        description="适合演示审批、待办、提醒类场景"
        tag="待办中心"
        tone="warning"
        trend="其中 4 项超过 24 小时未处理"
        :icon="Clock"
      />
      <MetricCard
        title="本月签约额"
        :value="formatCurrency(summary?.metrics.monthlyRevenue || 0)"
        description="工作台中常见的经营类统计卡片"
        tag="经营指标"
        tone="success"
        trend="较上月提升 12.6%"
        :icon="TrendCharts"
      />
      <MetricCard
        title="服务可用性"
        :value="formatPercent(summary?.metrics.availability || 0)"
        description="适合接入平台稳定性和服务状态指标"
        tag="系统健康"
        tone="danger"
        trend="近 30 天内 SLA 保持稳定"
        :icon="DataLine"
      />
    </div>

    <div class="content-grid" style="margin-top: 18px">
      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">待处理事项</div>
                <div class="panel-title__desc">演示工作台中“指标 + 待办”的典型组合</div>
              </div>
              <div class="soft-tag">
                <el-icon><Checked /></el-icon>
                {{ summary?.pendingTasks?.length || 0 }} 项任务
              </div>
            </div>
          </template>

          <div class="task-list">
            <div v-for="task in summary?.pendingTasks || []" :key="task.title" class="task-list__item">
              <div>
                <div class="task-list__title">{{ task.title }}</div>
                <div class="task-list__meta">{{ task.owner }} · 截止 {{ task.deadline }}</div>
              </div>
              <el-tag :type="task.priority === '高' ? 'danger' : task.priority === '中' ? 'warning' : 'info'">
                {{ task.priority }}
              </el-tag>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">页面模式覆盖</div>
                <div class="panel-title__desc">主干内置的通用后台页面模式</div>
              </div>
            </div>
          </template>

          <div class="info-grid">
            <InfoTile
              v-for="item in summary?.pageModes || []"
              :key="item.title"
              :title="item.title"
              :value="item.value"
              :description="item.description"
              :tone="item.tone"
            />
          </div>
        </el-card>
      </div>

      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">近期活动</div>
                <div class="panel-title__desc">适合在首页展示动态、日志和状态流转</div>
              </div>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="item in summary?.recentActivity || []"
              :key="`${item.time}-${item.title}`"
              :type="item.type"
              :timestamp="item.time"
            >
              <div class="timeline-note__title">{{ item.title }}</div>
              <div class="timeline-note__desc">{{ item.description }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">复用建议</div>
                <div class="panel-title__desc">推荐的新项目启动顺序</div>
              </div>
            </div>
          </template>

          <el-steps direction="vertical" :active="4" finish-status="success">
            <el-step title="保留主框架" description="沿用 layout、styles、router 和基础 API 封装" />
            <el-step title="替换示例页面" description="先替换 views/examples，再逐步替换 Mock 数据" />
            <el-step title="补充项目规范" description="把 docs/standards 和 docs/templates 改成当前项目版本" />
            <el-step title="接入真实后端" description="保持接口结构稳定，逐步将 Mock 切换为真实 API" />
          </el-steps>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  display: grid;
  gap: 12px;
}

.task-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(243, 246, 251, 0.92);
}

.task-list__title {
  font-size: 14px;
  font-weight: 700;
  color: #1a304b;
}

.task-list__meta {
  margin-top: 6px;
  font-size: 12px;
  color: #70829a;
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
