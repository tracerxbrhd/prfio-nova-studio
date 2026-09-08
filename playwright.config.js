import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', fullyParallel: false, reporter: 'list', use: { baseURL: 'http://127.0.0.1:5191', headless: true }, webServer: { command: 'npm run dev -- --port 5191 --strictPort', url: 'http://127.0.0.1:5191', reuseExistingServer: false } });
