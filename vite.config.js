import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'gcp.rfonlinenexus.com' // Add your host here
    ]
  }
});