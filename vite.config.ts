import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  console.log("Vite Config: VITE_GEMINI_API_KEY length:", env.VITE_GEMINI_API_KEY?.length || 0);
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false, // 已经有 public/manifest.json 了，或者在这里配置
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          // 确保 index.html 始终被视为入口
          navigateFallback: '/index.html',
          // 排除特定的 Vercel 路由或 API
          navigateFallbackDenylist: [/^\/v1/],
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
