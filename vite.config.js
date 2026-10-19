import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { prerenderSeo } from './scripts/prerenderSeo.js'

export default defineConfig({
  plugins: [
    react(),
    // Writes a static <head> per route + generates sitemap.xml / robots.txt.
    // Must run before VitePWA so the service worker precaches the final assets.
    prerenderSeo(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
      enabled: true
      },
      manifest: {
        name: 'English Exam Excellence',
        short_name: 'TELC Excellence',
        theme_color: '#B71C1C',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // App navigations are served from the cached root shell; the prerendered
        // per-route shells are the crawler's copy and must NOT be precached.
        navigateFallback: 'index.html',
        globPatterns: [
          'index.html',
          'manifest.webmanifest',
          'og-image.png',
          'assets/**/*.{js,css,woff,woff2,png,svg,webp}',
          'images/**/*.{png,jpg,jpeg,webp}'
        ],
        globIgnores: ['**/telc/**', '**/free-test/**', '**/pricing/**', '**/privacy/**', '**/contact/**', '**/sitemap/**'],
        cleanupOutdatedCaches: true
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true
  }
})