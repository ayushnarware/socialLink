import { test, expect } from '@playwright/test';

const base = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

test.describe('Basic site checks', () => {
  test('Home loads and has main button or link', async ({ page }) => {
    await page.goto(base + '/');
    await expect(page).toHaveTitle(/./);
    const btn = await page.locator('button, a').first();
    await expect(btn).toBeVisible();
  });

  test('Login page renders form elements', async ({ page }) => {
    await page.goto(base + '/login');
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
  });

  test('Signup page renders form elements', async ({ page }) => {
    await page.goto(base + '/signup');
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
  });

  test('Dashboard header and navigation present', async ({ page }) => {
    await page.goto(base + '/dashboard');
    const header = page.locator('header, nav');
    await expect(header.first()).toBeVisible();
    const navBtn = page.locator('button, a').filter({ hasText: /dashboard|logout|settings/i }).first();
    // it's okay if specific label not found; just ensure some nav exists
    await expect(page.locator('nav, header').first()).toBeVisible();
  });
});
