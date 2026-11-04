import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/..." → src/ (required by shadcn/ui and Shadcn Space blocks)
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    watch: {
      // Not part of the site: the graft index rewrites itself as code changes,
      // the API has its own dev server, and Playwright writes logs. Watching
      // them made Vite reload open pages mid-use.
      ignored: ['**/graft/**', '**/Backend/**', '**/.playwright-mcp/**'],
    },
  },
})
