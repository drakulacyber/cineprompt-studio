import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Menggunakan relative path agar bekerja di localhost dan GitHub Pages subpath
  server: {
    port: 3000,
    host: true
  }
});
