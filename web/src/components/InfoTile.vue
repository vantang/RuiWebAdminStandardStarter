<script setup>
defineProps({
  title: { type: String, default: "" },
  value: { type: String, default: "" },
  description: { type: String, default: "" },
  tone: { type: String, default: "brand" },
});
</script>

<template>
  <div class="info-tile" :class="`info-tile--${tone}`">
    <div class="info-tile__title">{{ title }}</div>
    <div class="info-tile__value">{{ value }}</div>
    <div class="info-tile__description">{{ description }}</div>
  </div>
</template>

<style scoped>
.info-tile {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(15, 39, 70, 0.08);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(19, 47, 89, 0.06);
}

.info-tile__title {
  font-size: 13px;
  color: #6b7a90;
}

.info-tile__value {
  margin-top: 12px;
  font-size: 26px;
  font-weight: 700;
  color: #1b314b;
}

.info-tile__description {
  min-height: 38px;
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #72849a;
}

.info-tile--brand {
  border-left: 4px solid #1f6feb;
}

.info-tile--warning {
  border-left: 4px solid #d97706;
}

.info-tile--success {
  border-left: 4px solid #15803d;
}

.info-tile--danger {
  border-left: 4px solid #dc2626;
}
</style>
