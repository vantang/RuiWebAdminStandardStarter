import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
  });
}

async function waitForServerReady(baseUrl, child) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 10000) {
    if (child.exitCode !== null) {
      throw new Error(`Mock server exited unexpectedly with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the server is ready or timeout is reached.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("Timed out waiting for mock server to become ready");
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const json = await response.json();
  return { response, json };
}

async function main() {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: new URL("..", import.meta.url),
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += String(chunk);
  });

  try {
    await waitForServerReady(baseUrl, child);

    const health = await requestJson(baseUrl, "/api/health");
    assert.equal(health.response.status, 200);
    assert.equal(health.json.code, 200);
    assert.equal(health.json.data.status, "UP");

    const summary = await requestJson(baseUrl, "/api/dashboard/summary");
    assert.equal(summary.response.status, 200);
    assert.equal(summary.json.code, 200);
    assert.ok(summary.json.data.metrics.activeProjects > 0);
    assert.ok(summary.json.data.pendingTasks.length > 0);

    const login = await requestJson(baseUrl, "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
      }),
    });
    assert.equal(login.response.status, 200);
    assert.equal(login.json.code, 200);
    assert.equal(login.json.data.user.role, "平台管理员");
    assert.ok(login.json.data.permissions.includes("permissions.manage"));

    const invalidLogin = await requestJson(baseUrl, "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "wrong-password",
      }),
    });
    assert.equal(invalidLogin.response.status, 401);
    assert.equal(invalidLogin.json.code, 401);

    const meta = await requestJson(baseUrl, "/api/meta/options");
    assert.equal(meta.response.status, 200);
    assert.ok(meta.json.data.statusOptions.length >= 4);
    assert.ok(meta.json.data.ownerOptions.length >= 4);
    assert.ok(meta.json.data.roleOptions.length >= 3);
    assert.ok(meta.json.data.userStatusOptions.length >= 3);

    const customers = await requestJson(baseUrl, "/api/customers?page=1&pageSize=4&status=active");
    assert.equal(customers.response.status, 200);
    assert.equal(customers.json.data.page, 1);
    assert.equal(customers.json.data.pageSize, 4);
    assert.ok(customers.json.data.list.length > 0);
    assert.ok(customers.json.data.total >= customers.json.data.list.length);

    const customerDetail = await requestJson(baseUrl, "/api/customers/CUS-1001");
    assert.equal(customerDetail.response.status, 200);
    assert.equal(customerDetail.json.data.id, "CUS-1001");
    assert.ok(customerDetail.json.data.activities.length > 0);

    const missingCustomer = await requestJson(baseUrl, "/api/customers/UNKNOWN");
    assert.equal(missingCustomer.response.status, 404);
    assert.equal(missingCustomer.json.code, 404);

    const userList = await requestJson(baseUrl, "/api/users?page=1&pageSize=4&role=operator");
    assert.equal(userList.response.status, 200);
    assert.equal(userList.json.data.page, 1);
    assert.equal(userList.json.data.pageSize, 4);
    assert.ok(userList.json.data.list.length > 0);
    assert.ok(userList.json.data.list.every((item) => item.role === "operator"));

    const userDetail = await requestJson(baseUrl, "/api/users/USR-1001");
    assert.equal(userDetail.response.status, 200);
    assert.equal(userDetail.json.data.id, "USR-1001");
    assert.ok(userDetail.json.data.activities.length > 0);

    const permissionOverview = await requestJson(baseUrl, "/api/permissions/overview");
    assert.equal(permissionOverview.response.status, 200);
    assert.ok(permissionOverview.json.data.roles.length >= 3);
    assert.ok(permissionOverview.json.data.matrix.length > 0);

    const settingsDetail = await requestJson(baseUrl, "/api/settings/profile");
    assert.equal(settingsDetail.response.status, 200);
    assert.equal(settingsDetail.json.data.workspaceName, "睿境管理后台演示工作区");

    const settingsUpdate = await requestJson(baseUrl, "/api/settings/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceName: "Smoke Test Workspace",
      }),
    });
    assert.equal(settingsUpdate.response.status, 200);
    assert.equal(settingsUpdate.json.data.workspaceName, "Smoke Test Workspace");

    const featured = await requestJson(baseUrl, "/api/projects/featured");
    assert.equal(featured.response.status, 200);
    assert.equal(featured.json.data.code, "PRJ-2026-001");
    assert.ok(featured.json.data.members.length > 0);

    const createProject = await requestJson(baseUrl, "/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectName: "Smoke Test Project",
        customerId: "CUS-1001",
        ownerId: "owner-liu"
      })
    });
    assert.equal(createProject.response.status, 200);
    assert.equal(createProject.json.code, 200);
    assert.match(createProject.json.data.id, /^PRJ-/);
    assert.equal(createProject.json.data.summary.projectName, "Smoke Test Project");
    assert.equal(createProject.json.data.summary.customerName, "星河零售");
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => {
      child.once("exit", () => resolve());
      setTimeout(() => {
        if (child.exitCode === null) {
          child.kill("SIGKILL");
        }
        resolve();
      }, 1000);
    });
  }

  if (stderr.trim()) {
    throw new Error(stderr.trim());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
