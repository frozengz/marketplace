import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const SRC_ALIAS = new URL('./src', import.meta.url).pathname;
export default defineConfig({ plugins: [react()], resolve: { alias: { '@': SRC_ALIAS } }, server: { host: '0.0.0.0', port: 5173 } });
