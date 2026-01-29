import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ['src/**/*.e2e.spec.ts'],
    globals: true,
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    clearMocks: true,
    unstubEnvs: true,
  },
})
