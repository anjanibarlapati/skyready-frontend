import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    watch: false,
    globals: true,
    setupFiles: './src/setupTests.ts',    
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        ...configDefaults.coverage?.exclude ?? [],
        'src/main.tsx',
      ],
    },
  },
} as UserConfig)