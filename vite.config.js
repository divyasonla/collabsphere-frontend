import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    watch: {
      // ignore large folders and use polling to avoid hitting inotify limits (EMFILE)
      ignored: ['**/node_modules/**', '**/.git/**', '../server/**', 'uploads/**'],
      usePolling: true,
      interval: 1000
    }
  }
})