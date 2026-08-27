import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page and show error for invalid credentials', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // Go to login page
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*login/);

    // Fill in credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('WrongPassword1!');
    
    // Submit
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify error message
    const errorMsg = page.locator('.error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Invalid email or password');
  });
});
