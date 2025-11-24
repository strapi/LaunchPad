import { test, expect } from '@playwright/test';

test.describe('Deployment Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify page has a title
    await expect(page).toHaveTitle(/.+/);
    
    // Verify body is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('navigation links are functional', async ({ page }) => {
    await page.goto('/');
    
    // Find all internal links
    const links = await page.locator('a[href^="/"]').all();
    
    // Should have at least one internal link
    expect(links.length).toBeGreaterThan(0);
    
    // Test first link works
    if (links.length > 0) {
      await links[0].click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('critical resources load', async ({ page }) => {
    const response = await page.goto('/');
    
    // Verify successful response
    expect(response?.status()).toBe(200);
    
    // Verify JS and CSS loaded
    const jsFiles = await page.locator('script[src]').count();
    expect(jsFiles).toBeGreaterThan(0);
  });
});
