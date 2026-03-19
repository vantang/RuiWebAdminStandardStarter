<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { metaApi, projectApi } from "@/api/modules";
import { formatCurrency } from "@/utils/format";

function createDefaultForm() {
  return {
    projectName: "",
    customerId: "",
    ownerId: "",
    category: "",
    deliveryDate: "",
    budget: 150000,
    priority: "medium",
    region: "",
    members: [],
    channels: ["email"],
    approvalMode: "serial",
    needPilot: true,
    weeklySync: true,
    qualityTarget: 80,
    experiencePriority: 4,
    description: "",
    remark: "",
  };
}

const formRef = ref();
const submitting = ref(false);
const options = ref({
  customerOptions: [],
  ownerOptions: [],
  categoryOptions: [],
  priorityOptions: [],
  regionOptions: [],
  memberOptions: [],
  channelOptions: [],
  approvalModeOptions: [],
});
const result = ref(null);
const form = reactive(createDefaultForm());

const rules = {
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
  ownerId: [{ required: true, message: "请选择负责人", trigger: "change" }],
  category: [{ required: true, message: "请选择项目类型", trigger: "change" }],
  deliveryDate: [{ required: true, message: "请选择交付日期", trigger: "change" }],
  budget: [{ required: true, message: "请输入预算", trigger: "blur" }],
};

function applyInitialOptions() {
  if (!form.customerId && options.value.customerOptions[0]) {
    form.customerId = options.value.customerOptions[0].value;
  }
  if (!form.ownerId && options.value.ownerOptions[0]) {
    form.ownerId = options.value.ownerOptions[0].value;
  }
  if (!form.category && options.value.categoryOptions[0]) {
    form.category = options.value.categoryOptions[0].value;
  }
  if (!form.region && options.value.regionOptions[0]) {
    form.region = options.value.regionOptions[0].value;
  }
}

async function loadOptions() {
  options.value = await metaApi.options();
  applyInitialOptions();
}

async function handleSubmit() {
  await formRef.value.validate();
  submitting.value = true;
  try {
    result.value = await projectApi.create({ ...form });
    ElMessage.success("表单提交成功，这里已经预留真实接口接入点");
  } finally {
    submitting.value = false;
  }
}

function handleReset() {
  Object.assign(form, createDefaultForm());
  applyInitialOptions();
  result.value = null;
}

onMounted(loadOptions);
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">表单页示例</h2>
        <div class="page-hero__subtitle">
          用一页覆盖后台项目中最常见的输入控件、分组表单、校验、开关和提交反馈方式。
        </div>
      </div>
      <div class="soft-tag">推荐把复杂表单拆成多个卡片区块</div>
    </section>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">基础信息</div>
              <div class="panel-title__desc">适合承载名称、客户、负责人、预算等主信息</div>
            </div>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :xs="24" :lg="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="客户" prop="customerId">
              <el-select v-model="form.customerId" placeholder="请选择客户" style="width: 100%">
                <el-option
                  v-for="item in options.customerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="负责人" prop="ownerId">
              <el-select v-model="form.ownerId" placeholder="请选择负责人" style="width: 100%">
                <el-option
                  v-for="item in options.ownerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="项目类型" prop="category">
              <el-select v-model="form.category" placeholder="请选择项目类型" style="width: 100%">
                <el-option
                  v-for="item in options.categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="交付日期" prop="deliveryDate">
              <el-date-picker v-model="form.deliveryDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="预算" prop="budget">
              <el-input-number v-model="form.budget" :min="0" :step="10000" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">协作与投放设置</div>
              <div class="panel-title__desc">这里演示单选、多选、开关、评分和滑块控件</div>
            </div>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :xs="24" :lg="8">
            <el-form-item label="优先级">
              <el-radio-group v-model="form.priority">
                <el-radio-button v-for="item in options.priorityOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="区域">
              <el-select v-model="form.region" placeholder="请选择区域" style="width: 100%">
                <el-option
                  v-for="item in options.regionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="审批模式">
              <el-select v-model="form.approvalMode" placeholder="请选择审批模式" style="width: 100%">
                <el-option
                  v-for="item in options.approvalModeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-form-item label="项目成员">
              <el-select v-model="form.members" multiple collapse-tags placeholder="请选择项目成员" style="width: 100%">
                <el-option
                  v-for="item in options.memberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-form-item label="通知渠道">
              <el-checkbox-group v-model="form.channels">
                <el-checkbox v-for="item in options.channelOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="试点验证">
              <el-switch v-model="form.needPilot" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="周报同步">
              <el-switch v-model="form.weeklySync" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :lg="8">
            <el-form-item label="体验优先级">
              <el-rate v-model="form.experiencePriority" />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item label="质量目标">
              <el-slider v-model="form.qualityTarget" show-input />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="panel-card">
        <template #header>
          <div class="panel-title">
            <div>
              <div class="panel-title__name">补充说明</div>
              <div class="panel-title__desc">长文本说明建议集中放在最后一个区块</div>
            </div>
          </div>
        </template>

        <el-form-item label="项目说明">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入项目目标、交付内容和实施范围"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="补充说明风险、依赖或外部约束" />
        </el-form-item>
      </el-card>

      <div class="footer-actions">
        <div class="button-row">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交表单</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <div class="soft-tag">预算预览：{{ formatCurrency(form.budget) }}</div>
      </div>
    </el-form>

    <el-card v-if="result" class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">提交结果</div>
            <div class="panel-title__desc">这里演示表单提交后的成功回显和后续动作入口</div>
          </div>
        </div>
      </template>

      <el-result icon="success" title="项目创建成功" :sub-title="`Mock 返回的项目编号：${result.id}`">
        <template #extra>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="提交时间">{{ result.submittedAt }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ result.statusLabel }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ result.summary.ownerName }}</el-descriptions-item>
            <el-descriptions-item label="客户">{{ result.summary.customerName }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<style scoped>
.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
</style>
