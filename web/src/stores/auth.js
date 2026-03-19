import { defineStore } from "pinia";
import { authApi } from "@/api/modules";

const STORAGE_KEY = "rui-admin-auth";

function readSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

const persisted = readSession();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: persisted?.token || "",
    currentUser: persisted?.user || null,
    permissions: persisted?.permissions || [],
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.currentUser),
  },
  actions: {
    hasPermission(permission) {
      return !permission || this.permissions.includes(permission);
    },
    persist() {
      writeSession({
        token: this.token,
        user: this.currentUser,
        permissions: this.permissions,
      });
    },
    async login(payload) {
      const session = await authApi.login(payload);
      this.token = session.token;
      this.currentUser = session.user;
      this.permissions = session.permissions;
      this.persist();
      return session;
    },
    logout() {
      this.token = "";
      this.currentUser = null;
      this.permissions = [];
      writeSession(null);
    },
  },
});
