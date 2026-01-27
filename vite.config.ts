import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    strictPort: false  // 如果3000被占用，自动尝试下一个
  },
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['better-sqlite3', 'koffi', 'silk-wasm', 'sherpa-onnx-node']
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      },
      {
        // 数据库解密 Worker 线程
        entry: 'electron/workers/decryptWorker.js',
        vite: {
          build: {
            outDir: 'dist-electron/workers',
            rollupOptions: {
              external: ['koffi']
            }
          }
        }
      },
      {
        // 语音转写 Worker 线程
        entry: 'electron/transcribeWorker.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['sherpa-onnx-node']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      external: [/^WeFlow\/.*/]
    }
  }
})
