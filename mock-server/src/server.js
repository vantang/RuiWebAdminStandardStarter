import http from "node:http";
import {
  authUsers,
  customerOptions,
  customers,
  dashboardSummary,
  featuredProject,
  metaOptions,
  ownerOptions,
  permissionOverview,
  settingsProfile,
  statusOptions,
  users,
} from "./data/demo.js";

const port = Number(process.env.PORT || 3101);
const host = process.env.HOST || "127.0.0.1";

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

function filterCustomers(searchParams) {
  const keyword = (searchParams.get("keyword") || "").trim().toLowerCase();
  const status = (searchParams.get("status") || "").trim();
  const owner = (searchParams.get("owner") || "").trim();

  return customers.filter((item) => {
    const matchesKeyword =
      !keyword ||
      [item.name, item.company, item.ownerName, ...item.tags].some((field) => field.toLowerCase().includes(keyword));
    const matchesStatus = !status || item.status === status;
    const matchesOwner = !owner || item.ownerId === owner;
    return matchesKeyword && matchesStatus && matchesOwner;
  });
}

function getStatusSummary(list) {
  const toneMap = {
    active: "success",
    onboarding: "brand",
    risk: "danger",
    paused: "warning",
  };

  return statusOptions.map((item) => ({
    title: item.label,
    value: list.filter((row) => row.status === item.value).length,
    description: `${item.label}状态下的客户数量`,
    tone: toneMap[item.value],
  }));
}

function filterUsers(searchParams) {
  const keyword = (searchParams.get("keyword") || "").trim().toLowerCase();
  const role = (searchParams.get("role") || "").trim();
  const status = (searchParams.get("status") || "").trim();

  return users.filter((item) => {
    const matchesKeyword =
      !keyword ||
      [item.name, item.email, item.deptName, item.roleLabel].some((field) => field.toLowerCase().includes(keyword));
    const matchesRole = !role || item.role === role;
    const matchesStatus = !status || item.status === status;
    return matchesKeyword && matchesRole && matchesStatus;
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { code: 200, message: "ok", data: { status: "UP" } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const body = await readBody(req);
      const account = authUsers.find((item) => item.username === body.username && item.password === body.password);

      if (!account) {
        sendJson(res, 401, { code: 401, message: "账号或密码错误" });
        return;
      }

      sendJson(res, 200, {
        code: 200,
        message: "success",
        data: {
          token: account.token,
          user: account.user,
          permissions: account.permissions,
        },
      });
    } catch (error) {
      sendJson(res, 400, { code: 400, message: error.message || "请求失败" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/dashboard/summary") {
    sendJson(res, 200, { code: 200, message: "success", data: dashboardSummary });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/meta/options") {
    sendJson(res, 200, { code: 200, message: "success", data: metaOptions });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/customers") {
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 8);
    const filtered = filterCustomers(url.searchParams);
    sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        list: paginate(filtered, page, pageSize),
        total: filtered.length,
        page,
        pageSize,
        statusSummary: getStatusSummary(filtered),
      },
    });
    return;
  }

  const customerMatch = url.pathname.match(/^\/api\/customers\/([^/]+)$/);
  if (req.method === "GET" && customerMatch) {
    const customer = customers.find((item) => item.id === customerMatch[1]);
    if (!customer) {
      sendJson(res, 404, { code: 404, message: "客户不存在" });
      return;
    }

    sendJson(res, 200, { code: 200, message: "success", data: customer });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/users") {
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 8);
    const filtered = filterUsers(url.searchParams);
    sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        list: paginate(filtered, page, pageSize),
        total: filtered.length,
        page,
        pageSize,
      },
    });
    return;
  }

  const userMatch = url.pathname.match(/^\/api\/users\/([^/]+)$/);
  if (req.method === "GET" && userMatch) {
    const user = users.find((item) => item.id === userMatch[1]);
    if (!user) {
      sendJson(res, 404, { code: 404, message: "用户不存在" });
      return;
    }

    sendJson(res, 200, { code: 200, message: "success", data: user });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/permissions/overview") {
    sendJson(res, 200, { code: 200, message: "success", data: permissionOverview });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/settings/profile") {
    sendJson(res, 200, { code: 200, message: "success", data: settingsProfile });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/api/settings/profile") {
    try {
      const body = await readBody(req);
      Object.assign(settingsProfile, body);
      sendJson(res, 200, { code: 200, message: "success", data: settingsProfile });
    } catch (error) {
      sendJson(res, 400, { code: 400, message: error.message || "请求失败" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/projects/featured") {
    sendJson(res, 200, { code: 200, message: "success", data: featuredProject });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/projects") {
    try {
      const body = await readBody(req);
      const customerName = customerOptions.find((item) => item.value === body.customerId)?.label || "未命名客户";
      const ownerName = ownerOptions.find((item) => item.value === body.ownerId)?.label || "未分配";
      sendJson(res, 200, {
        code: 200,
        message: "success",
        data: {
          id: `PRJ-${Date.now()}`,
          submittedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          statusLabel: "待评审",
          summary: {
            projectName: body.projectName,
            customerName,
            ownerName,
          },
        },
      });
    } catch (error) {
      sendJson(res, 400, { code: 400, message: error.message || "请求失败" });
    }
    return;
  }

  sendJson(res, 404, { code: 404, message: `未匹配的接口: ${req.method} ${url.pathname}` });
});

server.listen(port, host, () => {
  console.log(`Mock server running at http://${host}:${port}`);
});
