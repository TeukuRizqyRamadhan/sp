import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Agar bisa diakses dari IP lain
    port: 80, // Mengubah port menjadi 80
    strictPort: true, // Agar tidak pindah ke port lain jika 80 dipakai
  },
});
