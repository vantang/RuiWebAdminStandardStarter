import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const mockPort = Number(process.env.MOCK_PORT || 3101);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("@element-plus/icons-vue")) {
            return "element-plus-icons";
          }

          if (id.includes("echarts")) {
            return "echarts";
          }

          if (id.includes("element-plus")) {
            const componentMatch = id.match(/element-plus\/es\/components\/([^/]+)/);
            const componentName = componentMatch?.[1];
            const formComponents = new Set([
              "button",
              "checkbox",
              "date-picker",
              "form",
              "input",
              "input-number",
              "option",
              "radio",
              "rate",
              "select",
              "slider",
              "switch",
            ]);
            const dataComponents = new Set(["descriptions", "pagination", "progress", "table", "timeline"]);

            if (componentName && dataComponents.has(componentName)) {
              return "ep-data";
            }

            if (componentName && formComponents.has(componentName)) {
              return "ep-form";
            }
          }

          if (
            id.includes("async-validator") ||
            id.includes("dayjs") ||
            id.includes("lodash-unified") ||
            id.includes("@floating-ui") ||
            id.includes("@popperjs/core") ||
            id.includes("@ctrl/tinycolor")
          ) {
            return "ep-deps";
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${mockPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
  },
});
