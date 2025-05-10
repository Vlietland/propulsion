import { test, expect } from '@playwright/test';

test.describe('Example Test Suite', () => {
    test('should navigate to the specified URL and check page elements', async ({ page }) => {
        await page.goto('https://example.com');

        // Assert that the title is correct
        await expect(page).toHaveTitle('Example Domain');

        // Assert that the heading is visible
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText('Example Domain');

        // Assert that the link is present and has the correct URL
        const link = page.locator('a');
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', 'https://www.iana.org/domains/example');
    });
});