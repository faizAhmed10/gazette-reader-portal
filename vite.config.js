import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://gazette-backend-production.up.railway.app",
        changeOrigin: true, 
        secure: false,  
      },
    },
  },
});
