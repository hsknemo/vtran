import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import topLevelAwait from 'vite-plugin-top-level-await';
import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({ /* options */
      imports: ["vue", "vue-router"]
    }),
    vueJsx(),
    vueDevTools(),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
    legacy({
      // 'edge>=79, firefox>=67,chrome>=64, safari>=12,chromeAndroid>=64, iOS>=12'
      modernTargets: 'defaults',
      modernPolyfills: ['es.object.has-own'],
      renderLegacyChunks: false,
    })
  ],
  server:{
    host:'0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
