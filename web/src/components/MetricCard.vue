<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  value: { type: String, default: "" },
  description: { type: String, default: "" },
  tag: { type: String, default: "" },
  tone: { type: String, default: "brand" },
  icon: { type: [Object, Function], default: null },
  trend: { type: String, default: "" },
});
</script>

<template>
  <div class="metric-card" :class="`metric-card--${props.tone}`">
    <div class="metric-card__header">
      <div>
        <div class="metric-card__title">{{ props.title }}</div>
        <div class="metric-card__value">{{ props.value }}</div>
      </div>
      <div v-if="props.icon" class="metric-card__icon">
        <el-icon size="22"><component :is="props.icon" /></el-icon>
      </div>
    </div>
    <div class="metric-card__footer">
      <span>{{ props.description }}</span>
      <span v-if="props.tag" class="metric-card__tag">{{ props.tag }}</span>
    </div>
    <div v-if="props.trend" class="metric-card__trend">{{ props.trend }}</div>
  </div>
</template>

<style scoped>
.metric-card {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(15, 39, 70, 0.08);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 40px rgba(19, 47, 89, 0.07);
}

.metric-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.metric-card__title {
  font-size: 13px;
  color: #6b7a90;
}

.metric-card__value {
  margin-top: 12px;
  font-size: 30px;
  font-weight: 700;
  color: #162b44;
}

.metric-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
}

.metric-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  font-size: 13px;
  color: #6b7a90;
}

.metric-card__tag {
  padding: 5px 9px;
  border-radius: 999px;
  font-weight: 600;
}

.metric-card__trend {
  margin-top: 10px;
  font-size: 12px;
  color: #71849a;
}

.metric-card--brand .metric-card__icon,
.metric-card--brand .metric-card__tag {
  color: #1458b3;
  background: rgba(31, 111, 235, 0.1);
}

.metric-card--success .metric-card__icon,
.metric-card--success .metric-card__tag {
  color: #0f8b58;
  background: rgba(22, 163, 74, 0.1);
}

.metric-card--warning .metric-card__icon,
.metric-card--warning .metric-card__tag {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
}

.metric-card--danger .metric-card__icon,
.metric-card--danger .metric-card__tag {
  color: #b42318;
  background: rgba(239, 68, 68, 0.12);
}
</style>
