import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  clearScreen: true,
  test: {
    passWithNoTests: true,
    silent: 'passed-only',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
