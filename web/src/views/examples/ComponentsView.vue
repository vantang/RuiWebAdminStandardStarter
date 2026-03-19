<script setup>
import { ref } from "vue";

const dialogVisible = ref(false);
const drawerVisible = ref(false);
const activeTab = ref("summary");
const currentStep = ref(1);

const tabRows = [
  { name: "模板工作台", type: "Dashboard", owner: "产品团队" },
  { name: "客户列表页", type: "Table", owner: "运营团队" },
  { name: "项目表单页", type: "Form", owner: "交付团队" },
];
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">组件页示例</h2>
        <div class="page-hero__subtitle">
          这个页面专门用于集中演示常见控件效果，适合作为设计评审和组件复用的视觉参考。
        </div>
      </div>
      <div class="soft-tag">按钮、提示、抽屉、步骤条、Tabs、空状态都集中在这里</div>
    </section>

    <div class="content-grid">
      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">按钮与标签</div>
                <div class="panel-title__desc">后台场景中最常见的操作集合</div>
              </div>
            </div>
          </template>

          <div class="button-row">
            <el-button type="primary">主操作</el-button>
            <el-button>次操作</el-button>
            <el-button type="success" plain>成功操作</el-button>
            <el-button type="warning" plain>提醒操作</el-button>
            <el-button type="danger" plain>风险操作</el-button>
          </div>

          <div class="tag-list">
            <el-tag>默认标签</el-tag>
            <el-tag type="success">成功状态</el-tag>
            <el-tag type="warning">待确认</el-tag>
            <el-tag type="danger">高风险</el-tag>
            <el-tag effect="plain">次级信息</el-tag>
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">提示与反馈</div>
                <div class="panel-title__desc">适合演示 Alert、Progress 和状态说明</div>
              </div>
            </div>
          </template>

          <div class="section-stack">
            <el-alert
              title="信息提示"
              type="info"
              :closable="false"
              description="适合放在表单、详情页或文档页中提示上下文。"
              show-icon
            />
            <el-alert
              title="成功提示"
              type="success"
              :closable="false"
              description="适合说明某项配置或操作已经生效。"
              show-icon
            />
            <el-progress :percentage="72" />
            <el-progress :percentage="48" status="warning" />
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">步骤条与标签页</div>
                <div class="panel-title__desc">后台详情和流程页中很常用的组合</div>
              </div>
            </div>
          </template>

          <div class="section-stack">
            <el-steps :active="currentStep" finish-status="success">
              <el-step title="立项" description="需求确认" />
              <el-step title="实施" description="开发推进" />
              <el-step title="验收" description="项目交付" />
            </el-steps>

            <div class="button-row">
              <el-button @click="currentStep = Math.max(0, currentStep - 1)">上一步</el-button>
              <el-button type="primary" @click="currentStep = Math.min(2, currentStep + 1)">下一步</el-button>
            </div>

            <el-tabs v-model="activeTab">
              <el-tab-pane label="摘要" name="summary">
                <el-table :data="tabRows" stripe>
                  <el-table-column prop="name" label="模块名称" min-width="160" />
                  <el-table-column prop="type" label="类型" min-width="120" />
                  <el-table-column prop="owner" label="负责人" min-width="140" />
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="说明" name="notes">
                <el-empty description="这里适合放组件说明或二级内容" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>

      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">Dialog 与 Drawer</div>
                <div class="panel-title__desc">常用于二次确认和补充详情</div>
              </div>
            </div>
          </template>

          <div class="button-row">
            <el-button type="primary" @click="dialogVisible = true">打开 Dialog</el-button>
            <el-button @click="drawerVisible = true">打开 Drawer</el-button>
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">空状态与结果</div>
                <div class="panel-title__desc">适合演示页面异常和完成反馈</div>
              </div>
            </div>
          </template>

          <div class="section-stack">
            <el-empty description="当前没有可展示数据" />
            <el-result icon="success" title="配置保存成功" sub-title="适合放在成功页或创建完成页" />
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="Dialog 示例" width="420px">
      <span>这里适合展示确认类场景，例如删除、提交审批、发布配置。</span>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" size="40%" title="Drawer 示例">
      <p class="drawer-paragraph">这里适合展示二级详情、表单补充项或复杂配置预览。</p>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="推荐用途">详情补充、批量操作预览、审阅信息</el-descriptions-item>
        <el-descriptions-item label="不推荐用途">承载一个完整主流程页面</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.drawer-paragraph {
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.8;
  color: #566a82;
}
</style>
