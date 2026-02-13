import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'cinma.online',
        short_name: 'cinma',
        description: 'منصة المشاهدة العربية الأقوى',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),
    sitemap({ hostname: 'https://cinma.online' })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
});