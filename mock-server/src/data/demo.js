export const statusOptions = [
  { label: "服务中", value: "active" },
  { label: "实施中", value: "onboarding" },
  { label: "风险关注", value: "risk" },
  { label: "暂停", value: "paused" }
];

export const ownerOptions = [
  { label: "刘晨", value: "owner-liu" },
  { label: "王敏", value: "owner-wang" },
  { label: "周岚", value: "owner-zhou" },
  { label: "许涛", value: "owner-xu" }
];

export const customerOptions = [
  { label: "星河零售", value: "CUS-1001" },
  { label: "深蓝供应链", value: "CUS-1002" },
  { label: "启明医药", value: "CUS-1003" },
  { label: "北辰工业", value: "CUS-1004" },
  { label: "耀石文旅", value: "CUS-1005" },
  { label: "华策物流", value: "CUS-1006" },
  { label: "景曜教育", value: "CUS-1007" },
  { label: "拓海消费", value: "CUS-1008" }
];

export const categoryOptions = [
  { label: "标准实施", value: "standard" },
  { label: "试点验证", value: "pilot" },
  { label: "运营优化", value: "operation" },
  { label: "管理驾驶舱", value: "dashboard" }
];

export const priorityOptions = [
  { label: "高", value: "high" },
  { label: "中", value: "medium" },
  { label: "低", value: "low" }
];

export const regionOptions = [
  { label: "华东", value: "east" },
  { label: "华南", value: "south" },
  { label: "华北", value: "north" },
  { label: "全国", value: "nationwide" }
];

export const memberOptions = [
  { label: "宋悦 / 产品经理", value: "member-song" },
  { label: "何川 / 前端工程师", value: "member-he" },
  { label: "林霄 / 后端工程师", value: "member-lin" },
  { label: "赵宁 / 设计师", value: "member-zhao" },
  { label: "马可 / 交付经理", value: "member-ma" }
];

export const channelOptions = [
  { label: "邮件", value: "email" },
  { label: "飞书", value: "feishu" },
  { label: "企业微信", value: "wechat-work" }
];

export const approvalModeOptions = [
  { label: "串行审批", value: "serial" },
  { label: "并行审批", value: "parallel" },
  { label: "抄送确认", value: "notify" }
];

export const roleOptions = [
  { label: "平台管理员", value: "admin" },
  { label: "运营管理员", value: "operator" },
  { label: "只读访客", value: "viewer" }
];

export const userStatusOptions = [
  { label: "启用", value: "active" },
  { label: "待激活", value: "pending" },
  { label: "锁定", value: "locked" }
];

export const metaOptions = {
  statusOptions,
  ownerOptions,
  customerOptions,
  categoryOptions,
  priorityOptions,
  regionOptions,
  memberOptions,
  channelOptions,
  approvalModeOptions,
  roleOptions,
  userStatusOptions
};

function customerActivities(base) {
  return [
    {
      time: `${base}-03-15 14:30`,
      title: "同步回访",
      description: "客户确认本周需要补充自动化报表口径说明。"
    },
    {
      time: `${base}-03-08 10:15`,
      title: "方案评审",
      description: "完成项目方案评审，新增权限矩阵校对动作。"
    },
    {
      time: `${base}-03-02 18:05`,
      title: "交付检查",
      description: "交付经理完成阶段检查，记录两项依赖待处理。"
    }
  ];
}

export const customers = [
  {
    id: "CUS-1001",
    name: "星河零售",
    company: "星河零售集团",
    ownerId: "owner-liu",
    ownerName: "刘晨",
    status: "active",
    statusLabel: "服务中",
    planLabel: "旗舰版",
    annualContract: 560000,
    healthScore: 88,
    lastActiveAt: "2026-03-18 16:20",
    region: "华东",
    channel: "邮件",
    email: "admin@xinghe.example.com",
    phone: "021-5600-1021",
    tags: ["重点客户", "数据看板"],
    nextAction: "确认 4 月版本排期",
    activities: customerActivities("2026"),
    remark: "适合作为列表页演示的健康客户样例。"
  },
  {
    id: "CUS-1002",
    name: "深蓝供应链",
    company: "深蓝供应链科技",
    ownerId: "owner-wang",
    ownerName: "王敏",
    status: "onboarding",
    statusLabel: "实施中",
    planLabel: "专业版",
    annualContract: 420000,
    healthScore: 74,
    lastActiveAt: "2026-03-17 11:05",
    region: "华南",
    channel: "飞书",
    email: "ops@shenlan.example.com",
    phone: "0755-6038-2241",
    tags: ["实施中", "供应链"],
    nextAction: "推进组织架构导入",
    activities: customerActivities("2026"),
    remark: "适合演示实施中项目。"
  },
  {
    id: "CUS-1003",
    name: "启明医药",
    company: "启明医药科技",
    ownerId: "owner-zhou",
    ownerName: "周岚",
    status: "risk",
    statusLabel: "风险关注",
    planLabel: "旗舰版",
    annualContract: 780000,
    healthScore: 52,
    lastActiveAt: "2026-03-16 09:40",
    region: "华东",
    channel: "企业微信",
    email: "pm@qiming.example.com",
    phone: "021-8811-7720",
    tags: ["高风险", "审批改造"],
    nextAction: "确认审批流兼容方案",
    activities: customerActivities("2026"),
    remark: "适合演示风险客户。"
  },
  {
    id: "CUS-1004",
    name: "北辰工业",
    company: "北辰工业制造",
    ownerId: "owner-xu",
    ownerName: "许涛",
    status: "active",
    statusLabel: "服务中",
    planLabel: "标准版",
    annualContract: 360000,
    healthScore: 81,
    lastActiveAt: "2026-03-14 18:00",
    region: "华北",
    channel: "邮件",
    email: "service@beichen.example.com",
    phone: "010-6770-1129",
    tags: ["制造业", "续费观察"],
    nextAction: "准备续费报价单",
    activities: customerActivities("2026"),
    remark: "适合演示稳定客户。"
  },
  {
    id: "CUS-1005",
    name: "耀石文旅",
    company: "耀石文旅集团",
    ownerId: "owner-liu",
    ownerName: "刘晨",
    status: "paused",
    statusLabel: "暂停",
    planLabel: "专业版",
    annualContract: 240000,
    healthScore: 46,
    lastActiveAt: "2026-03-12 15:35",
    region: "全国",
    channel: "飞书",
    email: "delivery@yaoshi.example.com",
    phone: "0571-6680-3312",
    tags: ["暂停中", "预算待批"],
    nextAction: "等待预算恢复",
    activities: customerActivities("2026"),
    remark: "适合演示暂停状态。"
  },
  {
    id: "CUS-1006",
    name: "华策物流",
    company: "华策智慧物流",
    ownerId: "owner-wang",
    ownerName: "王敏",
    status: "active",
    statusLabel: "服务中",
    planLabel: "旗舰版",
    annualContract: 670000,
    healthScore: 92,
    lastActiveAt: "2026-03-18 09:10",
    region: "华南",
    channel: "企业微信",
    email: "ops@huace.example.com",
    phone: "020-9091-5572",
    tags: ["重点客户", "运营优化"],
    nextAction: "确认二期优化需求",
    activities: customerActivities("2026"),
    remark: "适合演示高健康度客户。"
  },
  {
    id: "CUS-1007",
    name: "景曜教育",
    company: "景曜教育服务",
    ownerId: "owner-zhou",
    ownerName: "周岚",
    status: "onboarding",
    statusLabel: "实施中",
    planLabel: "标准版",
    annualContract: 290000,
    healthScore: 69,
    lastActiveAt: "2026-03-11 13:22",
    region: "华东",
    channel: "邮件",
    email: "pm@jingyao.example.com",
    phone: "0512-8871-4431",
    tags: ["培训交付", "新项目"],
    nextAction: "收集第一轮培训反馈",
    activities: customerActivities("2026"),
    remark: "适合演示新实施项目。"
  },
  {
    id: "CUS-1008",
    name: "拓海消费",
    company: "拓海消费科技",
    ownerId: "owner-xu",
    ownerName: "许涛",
    status: "risk",
    statusLabel: "风险关注",
    planLabel: "专业版",
    annualContract: 510000,
    healthScore: 58,
    lastActiveAt: "2026-03-10 20:05",
    region: "全国",
    channel: "飞书",
    email: "delivery@tuohai.example.com",
    phone: "010-7701-6630",
    tags: ["高风险", "接口延期"],
    nextAction: "推动接口方确认联调窗口",
    activities: customerActivities("2026"),
    remark: "适合演示联调风险。"
  },
  {
    id: "CUS-1009",
    name: "卓信服务",
    company: "卓信企业服务",
    ownerId: "owner-liu",
    ownerName: "刘晨",
    status: "active",
    statusLabel: "服务中",
    planLabel: "专业版",
    annualContract: 330000,
    healthScore: 84,
    lastActiveAt: "2026-03-09 17:18",
    region: "华北",
    channel: "邮件",
    email: "success@zhuoxin.example.com",
    phone: "010-7680-2201",
    tags: ["续费中", "企业服务"],
    nextAction: "确认续费合同条款",
    activities: customerActivities("2026"),
    remark: "适合演示续费型客户。"
  },
  {
    id: "CUS-1010",
    name: "澄光能源",
    company: "澄光能源管理",
    ownerId: "owner-wang",
    ownerName: "王敏",
    status: "paused",
    statusLabel: "暂停",
    planLabel: "标准版",
    annualContract: 215000,
    healthScore: 49,
    lastActiveAt: "2026-03-08 09:02",
    region: "华南",
    channel: "企业微信",
    email: "ops@chengguang.example.com",
    phone: "0769-9011-8127",
    tags: ["暂停中", "环境依赖"],
    nextAction: "等待客户 IT 环境开通",
    activities: customerActivities("2026"),
    remark: "适合演示暂停和依赖卡点。"
  }
];

export const dashboardSummary = {
  metrics: {
    activeProjects: 18,
    pendingApprovals: 9,
    monthlyRevenue: 3260000,
    availability: 99.95
  },
  pendingTasks: [
    { title: "确认客户星河零售的四月交付排期", owner: "刘晨", deadline: "03-20", priority: "高" },
    { title: "补充启明医药的审批流兼容说明", owner: "周岚", deadline: "03-21", priority: "高" },
    { title: "更新本周运营周报中的风险客户列表", owner: "王敏", deadline: "03-22", priority: "中" },
    { title: "复核北辰工业的续费报价配置", owner: "许涛", deadline: "03-25", priority: "低" }
  ],
  recentActivity: [
    {
      time: "2026-03-19 09:40",
      title: "模板文档已更新",
      description: "新增后台项目复用规范，并补充页面模板和接口模板。",
      type: "primary"
    },
    {
      time: "2026-03-18 18:20",
      title: "列表页交互已补齐",
      description: "完成筛选、分页、详情抽屉和批量选择的示例。",
      type: "success"
    },
    {
      time: "2026-03-18 11:10",
      title: "表单页已接入 Mock 提交",
      description: "提交后返回回显数据，用于演示真实接口接入点。",
      type: "warning"
    }
  ],
  pageModes: [
    {
      title: "工作台",
      value: "4 种",
      description: "指标卡、待办、活动流、步骤说明已内置",
      tone: "brand"
    },
    {
      title: "列表页",
      value: "1 套",
      description: "筛选、批量、表格、分页、详情抽屉",
      tone: "success"
    },
    {
      title: "表单页",
      value: "1 套",
      description: "分区表单、校验、开关、评分、滑块",
      tone: "warning"
    },
    {
      title: "详情页",
      value: "1 套",
      description: "摘要、描述列表、成员、时间线、附件",
      tone: "danger"
    }
  ]
};

export const featuredProject = {
  id: "PRJ-2026-001",
  code: "PRJ-2026-001",
  name: "睿境管理后台标准底座升级",
  customerName: "模板内部项目",
  ownerName: "刘晨",
  statusLabel: "执行中",
  stageLabel: "设计与开发",
  description:
    "将历史业务项目抽象为通用后台模板，保留标准布局、Mock 接口、规范文档和常见页面模式，用于后续后台项目复用。",
  startDate: "2026-03-01",
  deliveryDate: "2026-04-10",
  budget: 280000,
  spent: 163000,
  progress: 72,
  riskCount: 2,
  activeStep: 1,
  milestones: [
    { title: "模板边界梳理", date: "2026-03-05", status: "done", statusLabel: "已完成" },
    { title: "页面底座重构", date: "2026-03-20", status: "current", statusLabel: "进行中" },
    { title: "规范文档沉淀", date: "2026-03-28", status: "todo", statusLabel: "待开始" }
  ],
  members: [
    { name: "刘晨", role: "产品负责人", allocation: "40%", statusLabel: "已投入" },
    { name: "何川", role: "前端工程师", allocation: "60%", statusLabel: "已投入" },
    { name: "赵宁", role: "设计师", allocation: "35%", statusLabel: "已投入" }
  ],
  activities: [
    { time: "2026-03-19 10:20", title: "更新页面模式", description: "新增详情页与组件页的统一模式说明。" },
    { time: "2026-03-18 17:40", title: "整理模板文档", description: "收口模板规范文档，并建立 standards 文档组。" },
    { time: "2026-03-17 14:10", title: "替换 Mock API", description: "通用化工作台、列表和表单接口。" }
  ],
  attachments: [
    { name: "后台模板技术方案.md", size: "24 KB", updatedAt: "2026-03-19 10:05" },
    { name: "页面方案模板.md", size: "8 KB", updatedAt: "2026-03-18 19:00" },
    { name: "API设计模板.md", size: "6 KB", updatedAt: "2026-03-18 19:00" }
  ]
};

function userActivities(name) {
  return [
    {
      time: "2026-03-19 09:10",
      title: "修改了工作台配置",
      description: `${name} 更新了首页指标卡显示顺序。`
    },
    {
      time: "2026-03-18 17:20",
      title: "处理了审批任务",
      description: `${name} 完成一项待审批流程的确认。`
    },
    {
      time: "2026-03-17 14:45",
      title: "导出了列表数据",
      description: `${name} 下载了一份后台用户清单。`
    }
  ];
}

export const authUsers = [
  {
    username: "admin",
    password: "admin123",
    token: "token-admin-demo",
    user: {
      id: "AUTH-001",
      name: "Rui Admin",
      role: "平台管理员"
    },
    permissions: ["dashboard.view", "examples.view", "users.read", "permissions.manage", "settings.manage", "docs.view"]
  },
  {
    username: "operator",
    password: "operator123",
    token: "token-operator-demo",
    user: {
      id: "AUTH-002",
      name: "运营管理员",
      role: "运营管理员"
    },
    permissions: ["dashboard.view", "examples.view", "users.read", "settings.manage", "docs.view"]
  }
];

export const users = [
  {
    id: "USR-1001",
    name: "刘晨",
    email: "liuchen@ruiadmin.demo",
    deptName: "平台产品部",
    role: "admin",
    roleLabel: "平台管理员",
    status: "active",
    statusLabel: "启用",
    dataScope: "全部数据",
    lastLoginAt: "2026-03-19 09:20",
    tags: ["全局权限", "模板维护"],
    activities: userActivities("刘晨")
  },
  {
    id: "USR-1002",
    name: "王敏",
    email: "wangmin@ruiadmin.demo",
    deptName: "运营交付部",
    role: "operator",
    roleLabel: "运营管理员",
    status: "active",
    statusLabel: "启用",
    dataScope: "运营条线",
    lastLoginAt: "2026-03-19 08:55",
    tags: ["交付负责人", "用户管理"],
    activities: userActivities("王敏")
  },
  {
    id: "USR-1003",
    name: "周岚",
    email: "zhoulan@ruiadmin.demo",
    deptName: "解决方案部",
    role: "operator",
    roleLabel: "运营管理员",
    status: "pending",
    statusLabel: "待激活",
    dataScope: "方案团队",
    lastLoginAt: "2026-03-18 18:10",
    tags: ["待激活", "方案评审"],
    activities: userActivities("周岚")
  },
  {
    id: "USR-1004",
    name: "许涛",
    email: "xutao@ruiadmin.demo",
    deptName: "客户成功部",
    role: "viewer",
    roleLabel: "只读访客",
    status: "active",
    statusLabel: "启用",
    dataScope: "客户成功视图",
    lastLoginAt: "2026-03-17 21:35",
    tags: ["只读", "客户成功"],
    activities: userActivities("许涛")
  },
  {
    id: "USR-1005",
    name: "宋悦",
    email: "songyue@ruiadmin.demo",
    deptName: "平台产品部",
    role: "admin",
    roleLabel: "平台管理员",
    status: "active",
    statusLabel: "启用",
    dataScope: "全部数据",
    lastLoginAt: "2026-03-16 14:02",
    tags: ["产品 owner", "审批配置"],
    activities: userActivities("宋悦")
  },
  {
    id: "USR-1006",
    name: "何川",
    email: "hechuan@ruiadmin.demo",
    deptName: "前端工程组",
    role: "operator",
    roleLabel: "运营管理员",
    status: "locked",
    statusLabel: "锁定",
    dataScope: "研发视图",
    lastLoginAt: "2026-03-14 09:48",
    tags: ["锁定中", "研发账号"],
    activities: userActivities("何川")
  },
  {
    id: "USR-1007",
    name: "赵宁",
    email: "zhaoning@ruiadmin.demo",
    deptName: "设计体验组",
    role: "viewer",
    roleLabel: "只读访客",
    status: "active",
    statusLabel: "启用",
    dataScope: "设计视图",
    lastLoginAt: "2026-03-13 11:15",
    tags: ["设计评审", "只读"],
    activities: userActivities("赵宁")
  },
  {
    id: "USR-1008",
    name: "马可",
    email: "make@ruiadmin.demo",
    deptName: "交付管理部",
    role: "operator",
    roleLabel: "运营管理员",
    status: "active",
    statusLabel: "启用",
    dataScope: "交付项目",
    lastLoginAt: "2026-03-12 16:44",
    tags: ["交付经理", "周报订阅"],
    activities: userActivities("马可")
  }
];

export const permissionOverview = {
  summary: [
    { title: "角色类型", value: 3, description: "平台管理员、运营管理员、只读访客", tone: "brand" },
    { title: "菜单权限", value: 6, description: "页面级访问权限示例数量", tone: "success" },
    { title: "动作权限", value: 5, description: "按钮级与行为级权限示例数量", tone: "warning" },
    { title: "授权矩阵", value: 7, description: "演示不同角色在模块上的访问差异", tone: "danger" }
  ],
  roles: [
    {
      name: "平台管理员",
      memberCount: 2,
      scope: "全局可用",
      description: "负责模板维护、权限配置和系统级设置。"
    },
    {
      name: "运营管理员",
      memberCount: 4,
      scope: "运营可用",
      description: "负责日常运营、用户管理和大部分业务配置。"
    },
    {
      name: "只读访客",
      memberCount: 2,
      scope: "只读可见",
      description: "适合审阅、观察和跨部门协同场景。"
    }
  ],
  menuPermissions: [
    { code: "dashboard.view", name: "查看工作台", description: "允许访问首页工作台和相关指标卡。" },
    { code: "examples.view", name: "查看示例页", description: "允许访问列表页、表单页、详情页和组件页。" },
    { code: "users.read", name: "查看用户管理", description: "允许查看用户列表、详情和账号基础资料。" },
    { code: "permissions.manage", name: "管理权限页", description: "允许查看授权矩阵并调整角色权限。" },
    { code: "settings.manage", name: "管理设置页", description: "允许修改工作区设置、通知策略和安全项。" },
    { code: "docs.view", name: "查看规范文档", description: "允许访问模板规范、API 文档和归档资料说明。" }
  ],
  actionPermissions: [
    { code: "user.export", name: "导出用户列表" },
    { code: "project.approve", name: "审批高风险配置" },
    { code: "settings.save", name: "保存系统设置" },
    { code: "permission.assign", name: "分配角色权限" },
    { code: "dashboard.share", name: "分享工作台" }
  ],
  matrix: [
    { module: "工作台", admin: "可访问", operator: "可访问", viewer: "可访问" },
    { module: "列表页示例", admin: "可访问", operator: "可访问", viewer: "可访问" },
    { module: "用户管理", admin: "可访问", operator: "可访问", viewer: "不可访问" },
    { module: "权限页示例", admin: "可访问", operator: "不可访问", viewer: "不可访问" },
    { module: "设置页示例", admin: "可访问", operator: "可访问", viewer: "不可访问" },
    { module: "导出操作", admin: "可执行", operator: "可执行", viewer: "不可执行" },
    { module: "修改权限", admin: "可执行", operator: "不可执行", viewer: "不可执行" }
  ]
};

export const settingsProfile = {
  workspaceName: "睿境管理后台演示工作区",
  timezone: "Asia/Shanghai",
  locale: "zh-CN",
  loginReminder: true,
  weeklyDigest: true,
  releaseNotice: true,
  approvalRequired: true,
  ipWhitelist: "10.10.0.0/16\n172.16.8.0/24"
};
