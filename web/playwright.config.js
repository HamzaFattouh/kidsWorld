import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || '5173';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./tests/e2e/arabic-reporter.js']
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'سطح المكتب (Desktop)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'الهاتف المحمول (Mobile)',
      use: {
        ...devices['Pixel 5'],
        isMobile: true
      }
    }
  ],
  webServer: {
    command: 'npm.cmd run dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120000
  }
});