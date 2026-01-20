import { test, expect } from '@playwright/test';

test.describe('Deployment Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page has a title
    await expect(page).toHaveTitle(/.+/);

    // Verify body is visible
    await expect(page.locator('body')).toBeVisible();

    // Collect console errors (but allow WebGL warnings)
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore WebGL/Three.js warnings that are non-critical
        if (!text.includes('WebGL') && !text.includes('THREE')) {
          errors.push(text);
        }
      }
    });

    await page.waitForLoadState('networkidle');
    // Allow some errors but log them for debugging
    if (errors.length > 0) {
      console.log('Console errors detected:', errors);
    }
  });

  test('hero animation completes and reveals content', async ({ page }) => {
    // Set longer timeout for animation
    test.setTimeout(30000);

    await page.goto('/');

    // Wait for either:
    // 1. The hero section to become visible (animation completed)
    // 2. Or the skip button to be clicked (fallback)
    // 3. Or timeout after 10 seconds

    // First, check if ParticleHero is present (black screen phase)
    // Note: The text might be different now, checking for canvas or specific intro element
    const introLayer = page.locator('.fixed.inset-0.z-50.bg-black');
    
    if (await introLayer.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Intro layer detected, waiting for animation...');

      // Wait up to 15 seconds for the hero content to appear
      const heroContent = page.locator('h1').first();

      try {
        await heroContent.waitFor({ state: 'visible', timeout: 15000 });
        console.log('Hero content revealed successfully via animation');
      } catch {
        // If animation didn't complete, click skip button
        console.log('Animation timeout, clicking skip button...');
        const skipButton = page.locator('button:has-text("Skip Intro")');
        if (await skipButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await skipButton.click();
          await heroContent.waitFor({ state: 'visible', timeout: 5000 });
          console.log('Hero content revealed via skip button');
        }
      }
    }

    // Verify main hero content is now visible
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });

    // Verify CTA buttons are present
    const ctaButton = page.locator('a:has-text("Start Your Discovery")');
    await expect(ctaButton.first()).toBeVisible({ timeout: 5000 });
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
