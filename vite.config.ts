import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// GitHub Pages will serve this repo at /BMV/
export default defineConfig({
  plugins: [react()],
  base: "/BMV/",
});

