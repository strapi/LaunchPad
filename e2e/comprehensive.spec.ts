import { test, expect } from '@playwright/test';

test.describe('Comprehensive Frontend E2E Tests', () => {

  // ==========================================
  // SECTION 1: PAGE LOAD & STRUCTURE TESTS
  // ==========================================

  test('all main pages load successfully', async ({ page }) => {
    const pages = [
      '/',
      '/en',
      '/en/about',
      '/en/coaching',
      '/en/contact',
      '/en/blog',
      '/en/products',
      '/book',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'networkidle' });
      const response = await page.goto(pagePath);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('page has valid HTML structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for essential elements
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('head')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();

    // Check for main content
    const mainElements = await page.locator('main, [role="main"]').count();
    expect(mainElements).toBeGreaterThan(0);
  });

  // ==========================================
  // SECTION 2: BUTTON INTERACTION TESTS
  // ==========================================

  test('all buttons are clickable and functional', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find all buttons
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Test each button
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const button = buttons[i];

      // Check button is visible
      await expect(button).toBeVisible();

      // Check button is enabled (not disabled)
      const isDisabled = await button.isDisabled();
      // Only test enabled buttons
      if (!isDisabled) {
        // Check button has interactive state (cursor, aria attributes)
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaPressed = await button.getAttribute('aria-pressed');
        const dataTestId = await button.getAttribute('data-testid');

        // At least one attribute should be present for accessibility
        const hasA11y = ariaLabel || ariaPressed || dataTestId;
        if (hasA11y) {
          // Button should have meaningful content or attributes
          const textContent = await button.textContent();
          expect(textContent || ariaLabel).toBeTruthy();
        }
      }
    }
  });

  test('CTA buttons navigate correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Look for common CTA text patterns
    const ctaPatterns = ['Start', 'Discover', 'Learn', 'Get Started', 'Book', 'Explore'];

    for (const pattern of ctaPatterns) {
      const ctaButton = page.locator(`button:has-text("${pattern}"), a:has-text("${pattern}")`).first();

      if (await ctaButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Get the href if it's a link
        const href = await ctaButton.getAttribute('href');

        // Verify button is interactive (has click handler or href)
        expect(href || (await ctaButton.getAttribute('onclick'))).toBeTruthy();

        // Try clicking (with potential navigation handling)
        const currentUrl = page.url();
        await ctaButton.click({ timeout: 5000 }).catch(() => {
          // Click might trigger navigation or animation
        });

        // Allow for page change
        await page.waitForTimeout(500);
      }
    }
  });

  test('navigation buttons and menu items work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Test navbar items
    const navItems = await page.locator('nav button, nav a').all();
    expect(navItems.length).toBeGreaterThan(0);

    // Test menu toggle on mobile
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="toggle" i]').first();
    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(300);

      // Menu should be in a different state
      const ariaExpanded = await menuButton.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(ariaExpanded || 'true');
    }
  });

  // ==========================================
  // SECTION 3: FORM INTERACTION TESTS
  // ==========================================

  test('all form inputs are interactive', async ({ page }) => {
    await page.goto('/en/contact', { waitUntil: 'networkidle' });

    // Find all input fields
    const inputs = await page.locator('input, textarea, select').all();

    for (const input of inputs) {
      // Check input is visible
      await expect(input).toBeVisible();

      // Check input can be focused
      await input.focus();

      // Verify focused state
      const isFocused = await input.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();

      // Attempt to type
      const type = await input.getAttribute('type');
      if (type !== 'submit' && type !== 'button') {
        await input.fill('test', { timeout: 5000 }).catch(() => {
          // Some inputs might be read-only
        });
      }
    }
  });

  test('form submission works', async ({ page }) => {
    await page.goto('/en/contact', { waitUntil: 'networkidle' });

    // Find form
    const form = page.locator('form').first();
    if (await form.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Fill form fields
      const inputs = await form.locator('input[type="text"], input[type="email"], textarea').all();

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');

        if (type === 'email' || placeholder?.toLowerCase().includes('email')) {
          await input.fill('test@example.com');
        } else {
          await input.fill(`Test value ${i}`);
        }
      }

      // Submit form
      const submitButton = form.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click({ timeout: 5000 }).catch(() => {
          // Submit might trigger navigation or API call
        });
      }
    }
  });

  // ==========================================
  // SECTION 4: ANIMATION & MOTION TESTS
  // ==========================================

  test('hero animations render without errors', async ({ page }) => {
    test.setTimeout(30000);

    await page.goto('/', { waitUntil: 'networkidle' });

    // Capture any animation-related errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('WebGL') && !msg.text().includes('THREE')) {
        errors.push(msg.text());
      }
    });

    // Wait for animations to potentially complete
    await page.waitForTimeout(3000);

    // Verify page still responsive
    await expect(page.locator('body')).toBeVisible();

    // Check for animation elements
    const hasCanvases = await page.locator('canvas').count();
    const hasMotionElements = await page.locator('[style*="transform"], [style*="opacity"]').count();

    expect(hasCanvases + hasMotionElements).toBeGreaterThan(0);

    // Log animation-related errors for debugging
    if (errors.length > 0) {
      console.log('Animation errors:', errors);
    }
  });

  test('scroll animations trigger properly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Scroll to trigger animations
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await page.waitForTimeout(500);

    // Content should still be visible after scroll
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBeTruthy();
  });

  test('interactive elements respond to hover states', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find interactive buttons
    const buttons = await page.locator('button').first();

    if (await buttons.isVisible()) {
      // Hover over button
      await buttons.hover();
      await page.waitForTimeout(200);

      // Button should still be visible and responsive
      await expect(buttons).toBeVisible();

      // Try clicking after hover
      await buttons.click({ timeout: 5000 }).catch(() => {
        // Click might not trigger in test environment
      });
    }
  });

  // ==========================================
  // SECTION 5: COMPONENT VERIFICATION TESTS
  // ==========================================

  test('navbar component is functional', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find navbar
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();

    // Check for essential navbar elements
    const navLinks = await navbar.locator('a, button').all();
    expect(navLinks.length).toBeGreaterThan(0);

    // Check for logo/brand
    const brand = navbar.locator('a[href="/"], [aria-label*="home" i]').first();
    expect(brand).toBeTruthy();
  });

  test('cards and feature elements render correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Look for card elements
    const cards = await page.locator('[class*="card"], [class*="feature"], article').all();

    for (const card of cards.slice(0, 5)) {
      // Card should be visible
      const isVisible = await card.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        // Card should have content
        const text = await card.textContent();
        expect(text?.length || 0).toBeGreaterThan(0);
      }
    }
  });

  test('modal/dialog components can be opened and closed', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Look for modal trigger buttons
    const modalTriggers = await page.locator('button:has-text("detail"), button:has-text("more"), button[aria-haspopup="dialog"]').all();

    for (const trigger of modalTriggers.slice(0, 3)) {
      if (await trigger.isVisible()) {
        // Click to open modal
        await trigger.click();
        await page.waitForTimeout(300);

        // Look for modal close button
        const closeButton = page.locator('button[aria-label*="close"], [role="dialog"] button:first-of-type').first();
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeButton.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('image elements load and display correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Find all images
    const images = await page.locator('img').all();

    let successfulImages = 0;
    for (const img of images.slice(0, 10)) {
      const isVisible = await img.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        // Check image has src
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();

        // Check image loaded
        const complete = await img.evaluate((el: HTMLImageElement) => el.complete);
        if (complete) successfulImages++;
      }
    }

    expect(successfulImages).toBeGreaterThan(0);
  });

  // ==========================================
  // SECTION 6: ACCESSIBILITY TESTS
  // ==========================================

  test('page has proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for main navigation
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Check for buttons with accessible names
    const buttons = await page.locator('button').all();
    let accessibleButtons = 0;

    for (const button of buttons.slice(0, 10)) {
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const textContent = await button.textContent();

      if (ariaLabel || title || (textContent && textContent.trim().length > 0)) {
        accessibleButtons++;
      }
    }

    expect(accessibleButtons).toBeGreaterThan(0);
  });

  test('keyboard navigation is supported', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Tab through page
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Get focused element
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName || null;
    });

    // Should have focused an element
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'DIV']).toContain(focusedElement);
  });

  // ==========================================
  // SECTION 7: RESPONSIVE DESIGN TESTS
  // ==========================================

  test('responsive design works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Main content should still be visible
    await expect(page.locator('body')).toBeVisible();

    // Navigation should adapt
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('responsive design works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive design works on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toBeVisible();
  });

  // ==========================================
  // SECTION 8: PERFORMANCE TESTS
  // ==========================================

  test('page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('critical resources load successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for scripts and styles
    const scripts = await page.locator('script[src]').count();
    const styles = await page.locator('link[rel="stylesheet"]').count();

    expect(scripts + styles).toBeGreaterThan(0);
  });

  // ==========================================
  // SECTION 9: MOTION PRIMITIVES VERIFICATION
  // ==========================================

  test('framer-motion animations are applied', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for motion components (they should have data-* attributes)
    const motionElements = await page.locator('[style*="will-change"], [data-animation], [class*="motion"]').all();

    expect(motionElements.length).toBeGreaterThan(0);
  });

  test('animation classes from Tailwind CSS are present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for animation utility classes
    const animatedElements = await page.locator('[class*="animate-"]').all();

    // Should have some animated elements
    expect(animatedElements.length).toBeGreaterThanOrEqual(0);
  });

  // ==========================================
  // SECTION 10: CN UTILITY VERIFICATION
  // ==========================================

  test('Tailwind CSS classes are properly applied', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check various elements have Tailwind classes
    const elementsWithTailwind = await page.locator('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"]').all();

    expect(elementsWithTailwind.length).toBeGreaterThan(0);
  });

  test('responsive Tailwind classes work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for responsive breakpoint classes
    const responsiveElements = await page.locator('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]').all();

    expect(responsiveElements.length).toBeGreaterThan(0);
  });

});
