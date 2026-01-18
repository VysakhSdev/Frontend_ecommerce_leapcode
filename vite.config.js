import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // host: '0.0.0.0' is great for Docker/Mobile testing, 
    // but keep it as local by default if not needed.
    host: true, 
  },
  plugins: [react()],
  resolve: {
    alias: {
      // "Real" projects usually alias '@' to the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  // We remove the manual 'define' block. 
  // Use .env files with the VITE_ prefix instead (e.g., VITE_API_URL)
});