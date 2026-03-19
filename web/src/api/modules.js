import { request } from "./http";

export const authApi = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const dashboardApi = {
  summary() {
    return request("/dashboard/summary");
  },
};

export const customerApi = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/customers${query ? `?${query}` : ""}`);
  },
  detail(id) {
    return request(`/customers/${id}`);
  },
};

export const metaApi = {
  options() {
    return request("/meta/options");
  },
};

export const projectApi = {
  featured() {
    return request("/projects/featured");
  },
  create(payload) {
    return request("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const userApi = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ""}`);
  },
  detail(id) {
    return request(`/users/${id}`);
  },
};

export const permissionApi = {
  overview() {
    return request("/permissions/overview");
  },
};

export const settingsApi = {
  detail() {
    return request("/settings/profile");
  },
  update(payload) {
    return request("/settings/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
