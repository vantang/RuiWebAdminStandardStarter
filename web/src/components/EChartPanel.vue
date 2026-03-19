<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from "echarts/charts";
import { GridComponent, LegendComponent, RadarComponent, TooltipComponent } from "echarts/components";
import { LabelLayout } from "echarts/features";
import { init, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

use([
  BarChart,
  GaugeChart,
  GridComponent,
  LabelLayout,
  LegendComponent,
  LineChart,
  PieChart,
  RadarChart,
  RadarComponent,
  TooltipComponent,
  CanvasRenderer,
]);

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: [Number, String],
    default: 320,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const containerRef = ref(null);
const chartInstance = shallowRef(null);
const heightStyle = computed(() => (typeof props.height === "number" ? `${props.height}px` : props.height));

let resizeObserver = null;

function resizeChart() {
  chartInstance.value?.resize();
}

function syncLoadingState() {
  if (!chartInstance.value) {
    return;
  }

  if (props.loading) {
    chartInstance.value.showLoading("default", {
      maskColor: "rgba(255, 255, 255, 0.72)",
      textColor: "#1f6feb",
    });
    return;
  }

  chartInstance.value.hideLoading();
}

function syncOption() {
  if (!chartInstance.value) {
    return;
  }

  chartInstance.value.setOption(props.option || {}, {
    notMerge: true,
    lazyUpdate: true,
  });
  syncLoadingState();
}

async function ensureChart() {
  await nextTick();

  if (!containerRef.value || chartInstance.value) {
    return;
  }

  chartInstance.value = init(containerRef.value);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      resizeChart();
    });
    resizeObserver.observe(containerRef.value);
  }

  syncOption();
}

watch(
  () => props.option,
  async () => {
    if (!chartInstance.value) {
      await ensureChart();
      return;
    }

    syncOption();
  },
  { deep: true },
);

watch(
  () => props.loading,
  () => {
    syncLoadingState();
  },
);

onMounted(() => {
  ensureChart();
  window.addEventListener("resize", resizeChart);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", resizeChart);

  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});
</script>

<template>
  <div ref="containerRef" class="chart-surface" :style="{ height: heightStyle }" />
</template>

<style scoped>
.chart-surface {
  width: 100%;
  min-height: 240px;
}
</style>
