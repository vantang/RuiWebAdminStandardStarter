<script setup>
const standardsRows = [
  {
    name: "项目定位与复用方式",
    path: "/docs/standards/01-项目定位与复用方式.md",
    desc: "定义模板是什么、适合什么、不适合什么",
  },
  {
    name: "技术栈与目录规范",
    path: "/docs/standards/02-技术栈与目录规范.md",
    desc: "固定技术基线和目录分层方式",
  },
  {
    name: "设计系统与页面模式",
    path: "/docs/standards/03-设计系统与页面模式.md",
    desc: "说明后台页头、列表页、详情页和控件使用方式",
  },
  {
    name: "代码规范与协作约定",
    path: "/docs/standards/04-代码规范与协作约定.md",
    desc: "约束页面组织、组件抽象和主干演进方式",
  },
  {
    name: "文档规范与交付清单",
    path: "/docs/standards/05-文档规范与交付清单.md",
    desc: "约束交付文档和项目说明应如何沉淀",
  },
  {
    name: "提交与分支规范",
    path: "/docs/standards/06-提交与分支规范.md",
    desc: "统一分支前缀、提交格式和提交流程约定",
  },
];

const templateRows = [
  { name: "页面方案模板", path: "/docs/templates/页面方案模板.md", desc: "适合页面设计、评审和开发前对齐" },
  { name: "API 设计模板", path: "/docs/templates/API设计模板.md", desc: "适合接口设计和联调前统一格式" },
];

const folderRows = [
  { folder: "/web", desc: "前端 DEMO 和后台主框架" },
  { folder: "/mock-server", desc: "通用 Mock API 和示例数据" },
  { folder: "/docs/standards", desc: "模板长期稳定的规范文档" },
  { folder: "/docs/templates", desc: "可以复制到新项目继续使用的文档模板" },
];

const replaceRows = [
  { area: "可长期保留", items: "layout、styles、router、api/http、权限壳、文档目录结构" },
  { area: "优先替换", items: "views/examples、views/management、api/modules、Mock 数据、菜单名称" },
  { area: "按项目决定", items: "登录页文案、主题切换、测试深度、CI 流程和权限颗粒度" },
];
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">文档与规范中心</h2>
        <div class="page-hero__subtitle">
          这里聚合了这套标准底座真正应该被长期复用的部分：规范、模板、技术方案、权限壳边界和目录约束。
        </div>
      </div>
      <div class="soft-tag">模板主干已经覆盖登录、权限和常见管理页示例</div>
    </section>

    <el-row :gutter="18">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">规范文档</div>
                <div class="panel-title__desc">建议作为每个新后台项目的默认阅读入口</div>
              </div>
            </div>
          </template>

          <el-table :data="standardsRows" stripe>
            <el-table-column prop="name" label="文档名称" min-width="180" />
            <el-table-column prop="path" label="文件路径" min-width="260" show-overflow-tooltip />
            <el-table-column prop="desc" label="说明" min-width="220" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">模板文档</div>
                <div class="panel-title__desc">可以直接复制到新项目继续使用</div>
              </div>
            </div>
          </template>

          <el-table :data="templateRows" stripe>
            <el-table-column prop="name" label="模板名称" min-width="160" />
            <el-table-column prop="path" label="路径" min-width="240" show-overflow-tooltip />
            <el-table-column prop="desc" label="说明" min-width="200" />
          </el-table>

          <el-alert
            style="margin-top: 16px"
            type="info"
            title="建议做法"
            :closable="false"
            description="模板项目只保留通用文档，真实业务文档应在复制仓库后按项目重新生成。"
            show-icon
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="18">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">目录映射</div>
                <div class="panel-title__desc">用来区分模板主干、演示代码和文档资产</div>
              </div>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="item in folderRows" :key="item.folder" :label="item.folder">
              {{ item.desc }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">替换边界</div>
                <div class="panel-title__desc">新项目启动时，先判断哪些应该保留，哪些应该换掉</div>
              </div>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="item in replaceRows" :key="item.area" :label="item.area">
              {{ item.items }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
