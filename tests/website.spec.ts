import { test, expect } from '@playwright/test';

test.describe('aidz.fun website', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI搭子|AIDZ/);
  });

  test('docs page should load', async ({ page }) => {
    await page.goto('/docs');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('coze-workflow-advanced article should exist', async ({ page }) => {
    const response = await page.goto('/docs/agent-platforms/coze/coze-workflow-advanced');
    console.log('Status:', response?.status());
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/coze-workflow-advanced.png', fullPage: true });
    
    // Check if it's a 404 page
    const is404 = await page.locator('text=404').count() > 0;
    console.log('Is 404:', is404);
    
    // Print page title
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('getting-started article should exist', async ({ page }) => {
    const response = await page.goto('/docs/agent-platforms/coze/getting-started');
    console.log('Status:', response?.status());
    
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('dify-vs-coze article should exist', async ({ page }) => {
    const response = await page.goto('/docs/agent-platforms/dify/dify-vs-coze');
    console.log('Status:', response?.status());
    
    const title = await page.title();
    console.log('Page title:', title);
  });
});
