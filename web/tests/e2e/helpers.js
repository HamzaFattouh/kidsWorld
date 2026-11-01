import { expect } from '@playwright/test';

/**
 * Standard mocked responses for CMS & auto-generated routes
 */
export async function mockBackendApis(page) {
  await page.route('**/api/v1/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/auth/login')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: 'admin-e2e-id',
              name: 'مدير النظام',
              email: 'admin@kidsworld.ps',
              role: 'ADMIN',
              requiresPasswordChange: false
            },
            token: 'e2e-valid-jwt-token'
          }
        })
      });
    }

    if (method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: {} })
    });
  });
}

/**
 * Logs in as an Admin via the official login form with mocked API response.
 * Guarantees proper authentication state, cookies, and Zustand rehydration.
 */
export async function loginAsAdmin(page) {
  await mockBackendApis(page);

  await page.goto('/auth/login');
  const emailInput = page.locator('input[placeholder*="الاسم أو البريد الإلكتروني"]');
  const passwordInput = page.locator('input[placeholder*="••••••••"]');
  const submitBtn = page.locator('button[type="submit"]');

  await emailInput.fill('admin@kidsworld.ps');
  await passwordInput.fill('AdminPassword2026!');
  await submitBtn.click();

  await page.waitForURL(/\/admin/, { timeout: 10000 });
}

/**
 * Ensures the session starts fresh as an unauthenticated guest.
 */
export async function setupGuestSession(page) {
  await page.context().clearCookies();
  await page.goto('/auth/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export const setupGuestAuth = setupGuestSession;
export const setupAdminAuth = loginAsAdmin;

/**
 * Sets up network and console monitoring to detect:
 * - Uncaught JavaScript exceptions (pageerror)
 * - Console errors (console.error)
 * - 404 Not Found & 5xx Server Error responses
 */
export function setupNetworkAndConsoleMonitor(page, options = {}) {
  const {
    ignoredUrls = [],
    ignoredConsoleMessages = []
  } = options;

  const errors = {
    pageErrors: [],
    consoleErrors: [],
    failedRequests: []
  };

  // Monitor uncaught JavaScript exceptions
  page.on('pageerror', (exception) => {
    errors.pageErrors.push(exception.message || String(exception));
  });

  // Monitor console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const isIgnored = ignoredConsoleMessages.some((pattern) =>
        typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text)
      );
      if (!isIgnored) {
        errors.consoleErrors.push(text);
      }
    }
  });

  // Monitor failed network responses (404s, 500s)
  page.on('response', (response) => {
    const status = response.status();
    const url = response.url();

    const isIgnored = ignoredUrls.some((pattern) =>
      typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url)
    );

    if (!isIgnored && (status === 404 || status >= 500)) {
      errors.failedRequests.push({ url, status });
    }
  });

  return {
    errors,
    verifyHealth: () => {
      expect(
        errors.pageErrors,
        `Unexpected JavaScript errors found: ${errors.pageErrors.join(', ')}`
      ).toEqual([]);

      expect(
        errors.consoleErrors,
        `Unexpected console.error messages found: ${errors.consoleErrors.join(', ')}`
      ).toEqual([]);

      expect(
        errors.failedRequests,
        `Unexpected 404 or 5xx responses found: ${JSON.stringify(errors.failedRequests)}`
      ).toEqual([]);
    }
  };
}
