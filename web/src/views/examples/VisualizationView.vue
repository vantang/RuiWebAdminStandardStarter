<script setup>
import { computed, reactive } from "vue";
import { DataAnalysis, DataLine, Monitor, TrendCharts } from "@element-plus/icons-vue";
import EChartPanel from "@/components/EChartPanel.vue";
import MetricCard from "@/components/MetricCard.vue";
import { formatCurrency, formatPercent, formatPlainNumber } from "@/utils/format";

const palette = {
  brand: "#1f6feb",
  brandSoft: "rgba(31, 111, 235, 0.14)",
  teal: "#0f9d8a",
  tealSoft: "rgba(15, 157, 138, 0.12)",
  amber: "#d97706",
  amberSoft: "rgba(217, 119, 6, 0.12)",
  danger: "#c2410c",
  dangerSoft: "rgba(194, 65, 12, 0.12)",
  slate: "#64748b",
  ink: "#1f2a37",
  line: "rgba(15, 39, 70, 0.08)",
};

const periodPresets = [
  { label: "近 7 天", value: "7d", days: 7 },
  { label: "近 30 天", value: "30d", days: 30 },
  { label: "近 90 天", value: "90d", days: 90 },
];

const channelOptions = [
  { label: "全部渠道", value: "all", trafficShare: 1, costShare: 1, conversionDelta: 0, color: palette.brand },
  {
    label: "官网自然流量",
    value: "organic",
    trafficShare: 0.42,
    costShare: 0.18,
    conversionDelta: 0.4,
    color: palette.brand,
  },
  {
    label: "内容投放",
    value: "content",
    trafficShare: 0.28,
    costShare: 0.46,
    conversionDelta: -1.3,
    color: palette.teal,
  },
  {
    label: "渠道代理",
    value: "partner",
    trafficShare: 0.19,
    costShare: 0.24,
    conversionDelta: 1.6,
    color: palette.amber,
  },
  {
    label: "老客转介绍",
    value: "referral",
    trafficShare: 0.11,
    costShare: 0.12,
    conversionDelta: 2.5,
    color: palette.danger,
  },
];

const metricModes = [
  { label: "线索量", value: "leads", seriesName: "新增线索", compareName: "上期线索", badge: "线索趋势" },
  { label: "赢单量", value: "deals", seriesName: "赢单数量", compareName: "上期赢单", badge: "赢单趋势" },
  { label: "签约额", value: "revenue", seriesName: "签约金额", compareName: "上期签约", badge: "经营趋势" },
];

const businessOptions = [
  { label: "全业务线", value: "all" },
  { label: "零售增长", value: "retail" },
  { label: "企业服务", value: "enterprise" },
  { label: "平台运营", value: "operations" },
];

const dashboardFilters = reactive({
  businessLine: "all",
  focusChannel: "all",
  periodKey: "30d",
  customRange: [],
  metricMode: "leads",
  comparePrevious: true,
});

const businessProfiles = {
  all: {
    name: "全业务线",
    baseVisitors: 128450,
    baseConversion: 28.6,
    baseCost: 382000,
    baseSla: 99.2,
    metricPatterns: {
      leads: [188, 210, 224, 236, 281, 305, 322, 352],
      deals: [92, 108, 116, 134, 145, 162, 191, 214],
      revenue: [680, 720, 760, 790, 856, 924, 1038, 1160],
    },
    channelSeries: {
      organic: [320, 368, 402, 438],
      content: [168, 214, 246, 286],
      partner: [132, 149, 161, 176],
      referral: [74, 86, 98, 112],
    },
    industry: [35, 24, 18, 14, 9],
    radarCurrent: [84, 79, 88, 74, 68, 72],
    radarBenchmark: [72, 68, 75, 66, 61, 64],
    rankings: {
      leads: [1260, 1135, 980, 864, 822, 768],
      deals: [410, 376, 338, 305, 282, 249],
      revenue: [1860, 1735, 1480, 1364, 1222, 1168],
    },
  },
  retail: {
    name: "零售增长",
    baseVisitors: 96200,
    baseConversion: 31.2,
    baseCost: 268000,
    baseSla: 99.0,
    metricPatterns: {
      leads: [144, 162, 175, 186, 218, 236, 248, 276],
      deals: [62, 74, 82, 88, 96, 108, 122, 139],
      revenue: [420, 468, 512, 544, 602, 668, 732, 824],
    },
    channelSeries: {
      organic: [196, 214, 236, 268],
      content: [126, 149, 168, 194],
      partner: [62, 68, 74, 82],
      referral: [44, 52, 59, 66],
    },
    industry: [48, 18, 14, 12, 8],
    radarCurrent: [88, 84, 82, 71, 64, 69],
    radarBenchmark: [74, 72, 74, 66, 60, 61],
    rankings: {
      leads: [1128, 984, 842, 721, 668, 592],
      deals: [358, 324, 286, 248, 222, 198],
      revenue: [1620, 1440, 1290, 1178, 1064, 938],
    },
  },
  enterprise: {
    name: "企业服务",
    baseVisitors: 78300,
    baseConversion: 25.4,
    baseCost: 326000,
    baseSla: 99.4,
    metricPatterns: {
      leads: [118, 132, 148, 156, 172, 186, 201, 218],
      deals: [68, 74, 81, 93, 101, 109, 120, 128],
      revenue: [560, 614, 648, 706, 752, 814, 886, 964],
    },
    channelSeries: {
      organic: [122, 139, 148, 162],
      content: [82, 96, 104, 112],
      partner: [98, 112, 128, 142],
      referral: [34, 39, 45, 51],
    },
    industry: [16, 42, 8, 23, 11],
    radarCurrent: [78, 74, 80, 86, 76, 82],
    radarBenchmark: [69, 67, 72, 74, 68, 71],
    rankings: {
      leads: [864, 822, 776, 724, 668, 621],
      deals: [338, 312, 286, 264, 238, 221],
      revenue: [1710, 1588, 1496, 1368, 1282, 1196],
    },
  },
  operations: {
    name: "平台运营",
    baseVisitors: 68400,
    baseConversion: 22.8,
    baseCost: 214000,
    baseSla: 98.8,
    metricPatterns: {
      leads: [92, 104, 116, 124, 138, 149, 161, 178],
      deals: [44, 52, 60, 68, 73, 82, 89, 98],
      revenue: [318, 352, 386, 412, 458, 486, 534, 578],
    },
    channelSeries: {
      organic: [102, 118, 128, 136],
      content: [74, 86, 96, 112],
      partner: [46, 54, 63, 71],
      referral: [24, 31, 36, 44],
    },
    industry: [12, 22, 27, 21, 18],
    radarCurrent: [76, 71, 84, 62, 70, 66],
    radarBenchmark: [68, 65, 74, 58, 64, 61],
    rankings: {
      leads: [712, 688, 643, 594, 548, 516],
      deals: [248, 229, 214, 191, 176, 158],
      revenue: [1024, 986, 912, 878, 822, 764],
    },
  },
};

const rankingLabels = ["零售 SaaS", "营销中台", "企业培训", "供应链协同", "会员系统", "运维监控"];
const industryLabels = ["零售电商", "企业服务", "教育培训", "制造业", "医疗健康"];

const channelIndustryAdjustments = {
  all: [1, 1, 1, 1, 1],
  organic: [1.12, 0.98, 1.05, 0.92, 0.93],
  content: [1.18, 0.96, 1.14, 0.84, 0.88],
  partner: [0.88, 1.24, 0.92, 1.16, 0.96],
  referral: [0.82, 1.1, 0.86, 0.94, 1.32],
};

const radarAdjustments = {
  all: [0, 0, 0, 0, 0, 0],
  organic: [1, 0, 1, 0, 0, 0],
  content: [2, -3, 1, 0, -1, -1],
  partner: [-1, 2, -2, 2, 1, 2],
  referral: [-2, 1, -1, 1, 3, 4],
};

const activeProfile = computed(() => businessProfiles[dashboardFilters.businessLine]);
const activeChannel = computed(
  () => channelOptions.find((item) => item.value === dashboardFilters.focusChannel) || channelOptions[0],
);
const activeMetricMode = computed(
  () => metricModes.find((item) => item.value === dashboardFilters.metricMode) || metricModes[0],
);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addDays(date, offset) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function diffDays(start, end) {
  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  return Math.max(1, Math.round((endTime - startTime) / 86400000) + 1);
}

function formatDateLabel(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function buildAxisLabels(start, end) {
  const days = diffDays(start, end);
  const points = days <= 7 ? days : 8;
  const labels = [];

  for (let index = 0; index < points; index += 1) {
    const ratio = points === 1 ? 0 : index / (points - 1);
    const offset = Math.round((days - 1) * ratio);
    labels.push(formatDateLabel(addDays(start, offset)));
  }

  return labels;
}

function samplePattern(pattern, points, scale) {
  return Array.from({ length: points }, (_, index) => {
    const patternIndex = Math.round((index / Math.max(points - 1, 1)) * (pattern.length - 1));
    return Math.max(0, Math.round(pattern[patternIndex] * scale));
  });
}

function normalizeToPercent(values) {
  const total = values.reduce((sum, item) => sum + item, 0) || 1;
  return values.map((item) => Number(((item / total) * 100).toFixed(1)));
}

function formatMetricValue(metricMode, value) {
  if (metricMode === "revenue") {
    return formatCurrency(value * 1000);
  }

  return `${formatPlainNumber(value)} 条`;
}

function resetFilters() {
  dashboardFilters.businessLine = "all";
  dashboardFilters.focusChannel = "all";
  dashboardFilters.periodKey = "30d";
  dashboardFilters.customRange = [];
  dashboardFilters.metricMode = "leads";
  dashboardFilters.comparePrevious = true;
}

const activeWindow = computed(() => {
  if (
    dashboardFilters.customRange?.length === 2 &&
    dashboardFilters.customRange[0] &&
    dashboardFilters.customRange[1]
  ) {
    const [rawStart, rawEnd] = dashboardFilters.customRange;
    const start = rawStart <= rawEnd ? startOfDay(rawStart) : startOfDay(rawEnd);
    const end = rawStart <= rawEnd ? startOfDay(rawEnd) : startOfDay(rawStart);

    return {
      days: diffDays(start, end),
      start,
      end,
      label: `${formatDateLabel(start)} - ${formatDateLabel(end)}`,
      isCustom: true,
    };
  }

  const preset = periodPresets.find((item) => item.value === dashboardFilters.periodKey) || periodPresets[1];
  const end = startOfDay(new Date());
  const start = addDays(end, -(preset.days - 1));

  return {
    days: preset.days,
    start,
    end,
    label: preset.label,
    isCustom: false,
  };
});

const axisLabels = computed(() => buildAxisLabels(activeWindow.value.start, activeWindow.value.end));
const windowFactor = computed(() => activeWindow.value.days / 30);

const overviewMetrics = computed(() => {
  const profile = activeProfile.value;
  const channel = activeChannel.value;
  const rangeFactor = windowFactor.value;
  const trafficFactor = channel.trafficShare;
  const costFactor = channel.value === "all" ? 1 : channel.costShare;
  const conversion = Number(
    clamp(profile.baseConversion + channel.conversionDelta - Math.max(0, rangeFactor - 1) * 0.5, 12, 48).toFixed(1),
  );
  const sla = Number(clamp(profile.baseSla - Math.max(0, rangeFactor - 1.5) * 0.18, 97.2, 99.8).toFixed(1));

  return {
    visitors: Math.round(profile.baseVisitors * rangeFactor * trafficFactor),
    conversion,
    cost: Math.round(profile.baseCost * rangeFactor * costFactor),
    sla,
  };
});

const trendSeriesData = computed(() => {
  const pattern = activeProfile.value.metricPatterns[dashboardFilters.metricMode];
  const scale = windowFactor.value * activeChannel.value.trafficShare;
  return samplePattern(pattern, axisLabels.value.length, scale);
});

const previousTrendSeriesData = computed(() => {
  const pattern = activeProfile.value.metricPatterns[dashboardFilters.metricMode];
  const scale = windowFactor.value * activeChannel.value.trafficShare * 0.86;
  return samplePattern(pattern, axisLabels.value.length, scale);
});

const visibleChannelKeys = computed(() =>
  dashboardFilters.focusChannel === "all"
    ? channelOptions.filter((item) => item.value !== "all").map((item) => item.value)
    : [dashboardFilters.focusChannel],
);

const channelTotals = computed(() => {
  const profile = activeProfile.value;
  const scale = windowFactor.value;
  return channelOptions
    .filter((item) => item.value !== "all")
    .map((item) => ({
      ...item,
      total: profile.channelSeries[item.value].reduce((sum, point) => sum + point * scale, 0),
    }));
});

const topChannel = computed(() => {
  const [first] = [...channelTotals.value].sort((left, right) => right.total - left.total);
  return first || channelOptions[1];
});

const topChannelShare = computed(() => {
  const total = channelTotals.value.reduce((sum, item) => sum + item.total, 0) || 1;
  return Number(((topChannel.value.total / total) * 100).toFixed(1));
});

const industryDistribution = computed(() => {
  const base = activeProfile.value.industry;
  const adjustment = channelIndustryAdjustments[dashboardFilters.focusChannel];
  const adjusted = base.map((item, index) => item * adjustment[index]);
  const normalized = normalizeToPercent(adjusted);

  return industryLabels.map((name, index) => ({
    name,
    value: normalized[index],
  }));
});

const topIndustries = computed(() =>
  [...industryDistribution.value].sort((left, right) => right.value - left.value).slice(0, 2),
);

const radarCurrentData = computed(() =>
  activeProfile.value.radarCurrent.map((item, index) =>
    clamp(item + radarAdjustments[dashboardFilters.focusChannel][index], 45, 98),
  ),
);

const rankingData = computed(() => {
  const source = activeProfile.value.rankings[dashboardFilters.metricMode];
  const scale = windowFactor.value * activeChannel.value.trafficShare;
  return source.map((item) => Math.round(item * scale));
});

const trendDirection = computed(() => {
  const series = trendSeriesData.value;
  const delta = series[series.length - 1] - series[0];

  if (Math.abs(delta) < 8) {
    return "基本持平";
  }

  return delta > 0 ? "持续上升" : "阶段回落";
});

const peakPoint = computed(() => {
  const series = trendSeriesData.value;
  const maxValue = Math.max(...series);
  const index = series.indexOf(maxValue);

  return {
    value: maxValue,
    label: axisLabels.value[index] || "-",
  };
});

const highlightTags = computed(() => [
  activeWindow.value.isCustom ? "自定义日期" : activeWindow.value.label,
  activeProfile.value.name,
  activeChannel.value.label,
  activeMetricMode.value.label,
  dashboardFilters.comparePrevious ? "对比上期" : "仅当前周期",
]);

const metricCards = computed(() => [
  {
    title: "活跃访客",
    value: formatPlainNumber(overviewMetrics.value.visitors),
    description: `${activeWindow.value.label} 内的访问规模`,
    tag: activeProfile.value.name,
    tone: "brand",
    trend: `${activeChannel.value.label} 视角下可继续拆到来源明细`,
    icon: TrendCharts,
  },
  {
    title: "线索转化率",
    value: formatPercent(overviewMetrics.value.conversion),
    description: "会随渠道过滤和周期切换同步变化",
    tag: activeChannel.value.label,
    tone: "warning",
    trend: "适合继续联动漏斗和销售阶段分析",
    icon: DataLine,
  },
  {
    title: "投放成本",
    value: formatCurrency(overviewMetrics.value.cost),
    description: "渠道过滤后会切换为对应成本口径",
    tag: "成本结构",
    tone: "success",
    trend: "建议和线索质量、赢单率同时判断",
    icon: DataAnalysis,
  },
  {
    title: "核心服务 SLA",
    value: formatPercent(overviewMetrics.value.sla),
    description: "系统健康值可以单独作为右侧或下方摘要卡",
    tag: "稳定性",
    tone: "danger",
    trend: `${activeWindow.value.label} 内稳定性保持可控`,
    icon: Monitor,
  },
]);

const trendOption = computed(() => {
  const series = [
    {
      name: activeMetricMode.value.seriesName,
      type: "line",
      smooth: true,
      symbolSize: 8,
      lineStyle: {
        width: 3,
      },
      areaStyle: {
        color: palette.brandSoft,
      },
      data: trendSeriesData.value,
    },
  ];

  if (dashboardFilters.comparePrevious) {
    series.push({
      name: activeMetricMode.value.compareName,
      type: "line",
      smooth: true,
      symbolSize: 7,
      lineStyle: {
        width: 2,
        type: "dashed",
      },
      areaStyle: {
        color: palette.tealSoft,
      },
      data: previousTrendSeriesData.value,
    });
  }

  return {
    color: [palette.brand, palette.teal],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 0,
      textStyle: {
        color: palette.slate,
      },
    },
    grid: {
      left: 18,
      right: 18,
      top: 54,
      bottom: 18,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: palette.line },
      },
      axisLabel: {
        color: palette.slate,
      },
      data: axisLabels.value,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: palette.slate,
      },
      splitLine: {
        lineStyle: { color: palette.line },
      },
    },
    series,
  };
});

const channelOption = computed(() => {
  const stageLabels =
    activeWindow.value.days <= 10
      ? ["前段", "中前段", "中段", "当前"]
      : activeWindow.value.days <= 45
        ? ["第 1 周", "第 2 周", "第 3 周", "第 4 周"]
        : ["第 1 月", "第 2 月", "第 3 月", "当前"];

  const visibleChannels = channelOptions.filter((item) => visibleChannelKeys.value.includes(item.value));
  const series = visibleChannels.map((item) => ({
    name: item.label,
    type: "bar",
    stack: visibleChannels.length > 1 ? "channels" : undefined,
    barWidth: 22,
    emphasis: {
      focus: "series",
    },
    itemStyle: {
      color: item.color,
      borderRadius: [8, 8, 0, 0],
    },
    data: activeProfile.value.channelSeries[item.value].map((point) => Math.round(point * windowFactor.value)),
  }));

  return {
    color: visibleChannels.map((item) => item.color),
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: 0,
      textStyle: {
        color: palette.slate,
      },
    },
    grid: {
      left: 18,
      right: 18,
      top: 54,
      bottom: 18,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: palette.slate,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: { color: palette.line },
      },
      data: stageLabels,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: palette.slate,
      },
      splitLine: {
        lineStyle: { color: palette.line },
      },
    },
    series,
  };
});

const industryOption = computed(() => ({
  color: [palette.brand, palette.teal, palette.amber, "#2b6cb0", palette.danger],
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: 0,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: palette.slate,
    },
  },
  series: [
    {
      name: "客户行业分布",
      type: "pie",
      radius: ["48%", "72%"],
      center: ["50%", "46%"],
      label: {
        color: palette.ink,
        formatter: "{b|{b}}\n{d|{d}%}",
        rich: {
          b: {
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 18,
          },
          d: {
            fontSize: 12,
            color: palette.slate,
          },
        },
      },
      labelLine: {
        length: 12,
        length2: 10,
      },
      data: industryDistribution.value,
    },
  ],
}));

const radarOption = computed(() => ({
  color: [palette.brand, palette.amber],
  legend: {
    top: 0,
    textStyle: {
      color: palette.slate,
    },
  },
  radar: {
    radius: "62%",
    splitNumber: 4,
    axisName: {
      color: palette.slate,
    },
    splitArea: {
      areaStyle: {
        color: ["rgba(31, 111, 235, 0.03)", "rgba(31, 111, 235, 0.06)"],
      },
    },
    axisLine: {
      lineStyle: {
        color: palette.line,
      },
    },
    splitLine: {
      lineStyle: {
        color: palette.line,
      },
    },
    indicator: [
      { name: "线索质量", max: 100 },
      { name: "转化效率", max: 100 },
      { name: "跟进速度", max: 100 },
      { name: "客单价", max: 100 },
      { name: "复购率", max: 100 },
      { name: "续费率", max: 100 },
    ],
  },
  series: [
    {
      type: "radar",
      areaStyle: {
        opacity: 0.2,
      },
      data: [
        {
          value: radarCurrentData.value,
          name: `${activeProfile.value.name} 当前`,
        },
        {
          value: activeProfile.value.radarBenchmark,
          name: "模板基准线",
        },
      ],
    },
  ],
}));

const rankingOption = computed(() => ({
  color: [palette.brand],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: 18,
    right: 26,
    top: 18,
    bottom: 12,
    containLabel: true,
  },
  xAxis: {
    type: "value",
    axisLabel: {
      color: palette.slate,
    },
    splitLine: {
      lineStyle: { color: palette.line },
    },
  },
  yAxis: {
    type: "category",
    inverse: true,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: palette.ink,
      fontWeight: 600,
    },
    data: rankingLabels,
  },
  series: [
    {
      name: activeMetricMode.value.label,
      type: "bar",
      barWidth: 14,
      label: {
        show: true,
        position: "right",
        color: palette.slate,
        formatter: ({ value }) => {
          if (dashboardFilters.metricMode === "revenue") {
            return `${formatPlainNumber(value)}k`;
          }

          return formatPlainNumber(value);
        },
      },
      data: rankingData.value,
    },
  ],
}));

const slaOption = computed(() => ({
  series: [
    {
      name: "SLA",
      type: "gauge",
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      splitNumber: 5,
      center: ["50%", "56%"],
      radius: "92%",
      progress: {
        show: true,
        width: 18,
        itemStyle: {
          color: palette.brand,
        },
      },
      pointer: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [[1, "rgba(15, 39, 70, 0.1)"]],
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        distance: -24,
        length: 12,
        lineStyle: {
          width: 2,
          color: "#ffffff",
        },
      },
      axisLabel: {
        distance: 18,
        color: palette.slate,
        fontSize: 12,
      },
      anchor: {
        show: false,
      },
      title: {
        offsetCenter: [0, "78%"],
        color: palette.slate,
        fontSize: 14,
      },
      detail: {
        valueAnimation: true,
        fontSize: 30,
        fontWeight: 700,
        color: palette.ink,
        offsetCenter: [0, "8%"],
        formatter: "{value}%",
      },
      data: [{ value: overviewMetrics.value.sla, name: "当前系统稳定性" }],
    },
  ],
}));

const chartDecisionRows = [
  {
    chart: "折线图 / 面积图",
    scene: "时间趋势、阶段峰值、同比环比",
    note: "首页经营看板、活跃度分析、工单波动监控",
  },
  {
    chart: "柱状图 / 堆叠柱状图",
    scene: "类别对比、渠道结构、阶段分布",
    note: "渠道贡献、部门产出、季度目标完成情况",
  },
  {
    chart: "圆环图 / 饼图",
    scene: "占比构成、份额分布、轻量摘要",
    note: "行业结构、客户来源、订单类型拆分",
  },
  {
    chart: "雷达图",
    scene: "多维能力对比、团队画像、指标平衡性",
    note: "区域团队能力、产品竞争力、交付成熟度",
  },
  {
    chart: "仪表盘",
    scene: "单点健康值、SLA、目标达成率",
    note: "系统稳定性、满意度、风险阈值提醒",
  },
];

const dashboardInsights = computed(() => [
  `${activeWindow.value.label} 内，${activeProfile.value.name} 的 ${activeMetricMode.value.label}${trendDirection.value}，峰值出现在 ${peakPoint.value.label}。`,
  dashboardFilters.focusChannel === "all"
    ? `当前结构里 ${topChannel.value.label} 贡献最高，占全部渠道大约 ${formatPercent(topChannelShare.value)}。`
    : `当前聚焦 ${activeChannel.value.label}，对应转化率约 ${formatPercent(overviewMetrics.value.conversion)}，适合继续下钻来源质量。`,
  `${topIndustries.value[0]?.name || "-"} 与 ${topIndustries.value[1]?.name || "-"} 是主要行业板块，SLA 保持在 ${formatPercent(overviewMetrics.value.sla)}。`,
  `${activeMetricMode.value.label} 排名第一的是 ${rankingLabels[0]}，当前口径下约为 ${formatMetricValue(
    dashboardFilters.metricMode,
    rankingData.value[0] || 0,
  )}。`,
]);

const interactionTips = [
  {
    title: "筛选条件先决定口径",
    description: "业务线、渠道和周期都应该先于图表展示决定，避免一页里混合不同统计口径。",
  },
  {
    title: "趋势图承担解释主线",
    description: "首屏主图优先讲清一个变化，再让结构图、排名图和明细表解释原因。",
  },
  {
    title: "自定义日期默认覆盖快捷周期",
    description: "这页示例里只要选择了日期范围，就会以自定义日期为准，便于模拟真实业务后台的查询体验。",
  },
];
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <h2 class="page-hero__title">数据可视化页示例</h2>
        <div class="page-hero__subtitle">
          这版示例页已经补齐业务线、渠道、周期和趋势口径切换，更接近真实后台里可操作的仪表盘页面。
        </div>
      </div>
      <div class="hero-tags">
        <span v-for="tag in highlightTags" :key="tag" class="soft-tag">{{ tag }}</span>
      </div>
    </section>

    <el-card class="panel-card">
      <template #header>
        <div class="panel-title">
          <div>
            <div class="panel-title__name">分析筛选器</div>
            <div class="panel-title__desc">通过业务线、渠道、时间范围和主趋势口径控制整页图表联动。</div>
          </div>
          <el-button @click="resetFilters">重置为默认视角</el-button>
        </div>
      </template>

      <el-form inline class="dashboard-filter-form">
        <el-form-item label="业务线">
          <el-select v-model="dashboardFilters.businessLine" style="width: 180px">
            <el-option v-for="item in businessOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关注渠道">
          <el-select v-model="dashboardFilters.focusChannel" style="width: 180px">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="快捷周期">
          <el-radio-group v-model="dashboardFilters.periodKey">
            <el-radio-button v-for="item in periodPresets" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义日期">
          <el-date-picker
            v-model="dashboardFilters.customRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
          />
        </el-form-item>
      </el-form>

      <div class="dashboard-filter-toolbar">
        <div class="dashboard-filter-toolbar__group">
          <div class="dashboard-filter-toolbar__label">主趋势口径</div>
          <el-radio-group v-model="dashboardFilters.metricMode">
            <el-radio-button v-for="item in metricModes" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="dashboard-filter-toolbar__group">
          <div class="dashboard-filter-toolbar__label">趋势展示</div>
          <el-switch
            v-model="dashboardFilters.comparePrevious"
            inline-prompt
            active-text="对比上期"
            inactive-text="仅当前"
          />
        </div>
      </div>
    </el-card>

    <div class="metric-grid" style="margin-top: 18px">
      <MetricCard
        v-for="item in metricCards"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :description="item.description"
        :tag="item.tag"
        :tone="item.tone"
        :trend="item.trend"
        :icon="item.icon"
      />
    </div>

    <div class="chart-grid">
      <el-card class="panel-card chart-demo-card chart-demo-card--wide">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">业务趋势总览</div>
            <div class="chart-card__note">
              当前展示 {{ activeProfile.name }} 在 {{ activeWindow.label }} 内的 {{ activeMetricMode.badge }}，
              适合作为仪表盘首屏主图。
            </div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">{{ activeMetricMode.label }}</span>
            <span class="chart-badge chart-badge--success">{{ activeWindow.label }}</span>
          </div>
        </div>
        <EChartPanel :option="trendOption" :height="360" />
      </el-card>

      <el-card class="panel-card chart-demo-card chart-demo-card--wide">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">渠道线索构成</div>
            <div class="chart-card__note">
              当渠道为“全部渠道”时展示堆叠结构；切换到单一渠道后会自动聚焦该渠道自身的分段变化。
            </div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">堆叠柱状图</span>
            <span class="chart-badge chart-badge--warning">{{ activeChannel.label }}</span>
          </div>
        </div>
        <EChartPanel :option="channelOption" :height="340" />
      </el-card>

      <el-card class="panel-card chart-demo-card chart-demo-card--half">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">客户行业分布</div>
            <div class="chart-card__note">业务线和渠道会共同影响当前占比结构，适合和明细列表联动查看。</div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">圆环图</span>
          </div>
        </div>
        <EChartPanel :option="industryOption" :height="320" />
      </el-card>

      <el-card class="panel-card chart-demo-card chart-demo-card--half">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">区域团队能力画像</div>
            <div class="chart-card__note">这块常用于团队能力、区域经营成熟度或项目交付质量的多维对比。</div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">雷达图</span>
          </div>
        </div>
        <EChartPanel :option="radarOption" :height="320" />
      </el-card>

      <el-card class="panel-card chart-demo-card chart-demo-card--half">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">{{ activeMetricMode.label }}排名</div>
            <div class="chart-card__note">横向条形图适合展示 Top N，并配合当前趋势口径同步切换数值含义。</div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">Top 排名</span>
          </div>
        </div>
        <EChartPanel :option="rankingOption" :height="320" />
      </el-card>

      <el-card class="panel-card chart-demo-card chart-demo-card--half">
        <div class="chart-card__summary">
          <div>
            <div class="panel-title__name">系统健康度</div>
            <div class="chart-card__note">仪表盘适合保留单一关键健康值，旁边再配洞察、告警或处理时长等辅助信息。</div>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">仪表盘</span>
            <span class="chart-badge chart-badge--danger">{{ activeProfile.name }}</span>
          </div>
        </div>
        <EChartPanel :option="slaOption" :height="320" />
      </el-card>
    </div>

    <div class="content-grid" style="margin-top: 18px">
      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">图表选型速查</div>
                <div class="panel-title__desc">先确定要回答的问题，再决定图形，不要把后台页面做成图表陈列馆。</div>
              </div>
            </div>
          </template>

          <el-table :data="chartDecisionRows" stripe>
            <el-table-column prop="chart" label="图形类型" min-width="160" />
            <el-table-column prop="scene" label="适合表达什么" min-width="200" />
            <el-table-column prop="note" label="后台常见用法" min-width="240" />
          </el-table>
        </el-card>
      </div>

      <div class="section-stack">
        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">当前筛选洞察</div>
                <div class="panel-title__desc">这块用于模拟真实仪表盘里对当前图表口径的解释文字。</div>
              </div>
            </div>
          </template>

          <div class="tip-list">
            <div v-for="item in dashboardInsights" :key="item" class="tip-card">
              <div class="tip-card__desc">{{ item }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card">
          <template #header>
            <div class="panel-title">
              <div>
                <div class="panel-title__name">交互说明</div>
                <div class="panel-title__desc">真实项目里建议把图表筛选器、明细表和导出入口放在同一个分析闭环中。</div>
              </div>
            </div>
          </template>

          <div class="tip-list">
            <div v-for="item in interactionTips" :key="item.title" class="tip-card">
              <div class="tip-card__title">{{ item.title }}</div>
              <div class="tip-card__desc">{{ item.description }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.dashboard-filter-form {
  row-gap: 6px;
}

.dashboard-filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid rgba(15, 39, 70, 0.06);
}

.dashboard-filter-toolbar__group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-filter-toolbar__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
  margin-top: 18px;
}

.chart-demo-card {
  margin-bottom: 0;
}

.chart-demo-card--wide {
  grid-column: span 12;
}

.chart-demo-card--half {
  grid-column: span 6;
}

.chart-card__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.chart-card__note {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.chart-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.chart-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-600);
  background: var(--brand-soft);
}

.chart-badge--success {
  color: var(--success-500);
  background: var(--success-soft);
}

.chart-badge--warning {
  color: var(--warning-500);
  background: var(--warning-soft);
}

.chart-badge--danger {
  color: var(--danger-500);
  background: var(--danger-soft);
}

.tip-list {
  display: grid;
  gap: 12px;
}

.tip-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(243, 246, 251, 0.92);
}

.tip-card__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.tip-card__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .chart-demo-card--half {
    grid-column: span 12;
  }
}

@media (max-width: 960px) {
  .hero-tags {
    justify-content: flex-start;
  }

  .chart-card__summary {
    flex-direction: column;
  }

  .chart-card__meta {
    justify-content: flex-start;
  }

  .dashboard-filter-toolbar {
    align-items: flex-start;
  }

  .dashboard-filter-toolbar__group {
    width: 100%;
  }
}
</style>
