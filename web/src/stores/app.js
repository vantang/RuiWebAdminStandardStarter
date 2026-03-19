import { defineStore } from "pinia";
import { brand } from "@/config/brand";

const defaultVisitedViews = () => [
  {
    path: "/dashboard",
    title: "工作台",
    affix: true,
  },
];

export const useAppStore = defineStore("app", {
  state: () => ({
    sidebarCollapsed: false,
    workspace: {
      name: brand.demoWorkspaceName,
      mode: "DEMO",
    },
    visitedViews: defaultVisitedViews(),
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    setWorkspaceName(name) {
      if (!name) {
        return;
      }

      this.workspace.name = name;
    },
    resetVisitedViews() {
      this.visitedViews = defaultVisitedViews();
    },
    visitView(route) {
      const title = route.meta?.title;

      if (!title || !route.path.startsWith("/")) {
        return;
      }

      const existing = this.visitedViews.find((item) => item.path === route.path);
      if (existing) {
        existing.title = title;
        existing.affix = Boolean(route.meta?.affix);
        return;
      }

      this.visitedViews.push({
        path: route.path,
        title,
        affix: Boolean(route.meta?.affix),
      });
    },
    closeView(path) {
      this.visitedViews = this.visitedViews.filter((item) => item.affix || item.path !== path);
    },
  },
});
