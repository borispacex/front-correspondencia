import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  const apiPrefix = env.VITE_API_PREFIX || "/api-v1";
  const apiUrl = env.VITE_API_URL || "http://localhost:8000";

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
    ],

    server: {
      host: true,

      proxy: {
        [apiPrefix]: {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
