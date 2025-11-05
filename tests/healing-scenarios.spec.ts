/**
 * Self-Healing Test Scenarios
 * 
 * These tests demonstrate UI changes and how tests need to adapt.
 * Run without changes: all pass
 * Apply UI changes from /dev: some fail (need healing)
 */

import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, UserModal } from './helpers/page-objects';
import { TEST_USERS, UI_TEXT } from './helpers/test-data';

test.describe('Healing Scenario 1: Login Button Text Change', () => {
  test('using text content selector - FRAGILE', async ({ page }) => {
    await page.goto('/login');
    
    // This will BREAK when Change #1 is applied (text changes)
    const button = page.getByText(UI_TEXT.initial.loginButton);
    await expect(button).toBeVisible();
  });

  test('@smoke using data-testid - STABLE', async ({ page }) => {
    await page.goto('/login');
    
    // This will NOT break when Change #1 is applied
    const button = page.getByTestId('login-submit');
    await expect(button).toBeVisible();
  });
});

test.describe('Healing Scenario 2: Table Column Addition', () => {
  test('checking column count - FRAGILE', async ({ page }) => {
    await page.goto('/dashboard');
    
    // This will BREAK when Change #2 is applied (adds Department column)
    const headers = page.locator('thead th');
    await expect(headers).toHaveCount(4); // Name, Email, Role, Actions
  });

  test('checking column by index - FRAGILE', async ({ page }) => {
    await page.goto('/dashboard');
    
    // This will BREAK when Change #2 is applied
    const roleHeader = page.locator('thead th').nth(2);
    await expect(roleHeader).toContainText('Role');
  });

  test('checking specific column by testid - STABLE', async ({ page }) => {
    await page.goto('/dashboard');
    
    // This will NOT break when Change #2 is applied
    const nameHeader = page.getByTestId('header-name');
    await expect(nameHeader).toBeVisible();
  });
});

test.describe('Healing Scenario 3: Modal Title Change', () => {
  test('checking exact text - FRAGILE', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('add-user-button').click();
    
    // This will BREAK when Change #3 is applied
    const title = page.getByText(UI_TEXT.initial.modalTitle);
    await expect(title).toBeVisible();
  });

  test('checking with testid - STABLE', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByTestId('add-user-button').click();
    
    // This will NOT break when Change #3 is applied
    const title = page.getByTestId('modal-title');
    await expect(title).toBeVisible();
  });
});

test.describe('UI Change Verification', () => {
  test('verify all changes can be applied and reset', async ({ page }) => {
    // Navigate to dev tools
    await page.goto('/login');
    await page.evaluate(() => {
      window.location.href = '/dev';
    });
    await page.waitForURL('**/dev');
    
    // Apply all changes
    await page.getByTestId('apply-change-1').click();
    await page.waitForTimeout(200);
    await page.getByTestId('apply-change-2').click();
    await page.waitForTimeout(200);
    await page.getByTestId('apply-change-3').click();
    await page.waitForTimeout(200);
    
    // Verify changes took effect
    await page.getByTestId('nav-to-login').click();
    await expect(page.getByTestId('login-submit')).toContainText('Log In Now');
    
    // Reset
    await page.evaluate(() => {
      window.location.href = '/dev';
    });
    await page.waitForURL('**/dev');
    await page.getByTestId('reset-changes').click();
    await page.waitForTimeout(200);
    
    // Verify reset worked
    await page.getByTestId('nav-to-login').click();
    await expect(page.getByTestId('login-submit')).toContainText('Sign In');
  });
});

