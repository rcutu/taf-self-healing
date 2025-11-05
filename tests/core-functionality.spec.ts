/**
 * Core Functionality Tests
 * 
 * Essential tests covering main application features.
 * These tests demonstrate stable selectors (data-testid) vs fragile ones.
 */

import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, UserModal } from './helpers/page-objects';
import { TEST_USERS, UI_TEXT } from './helpers/test-data';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with stable selectors', async ({ page }) => {
    await loginPage.login(TEST_USERS.login.email, TEST_USERS.login.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should have correct button text - WILL BREAK with Change #1', async () => {
    // This test uses fragile text-based assertion
    await expect(loginPage.submitButton).toHaveText(UI_TEXT.initial.loginButton);
  });
});

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
  });

  test('should display user table with stable selectors', async () => {
    await expect(dashboardPage.userTable).toBeVisible();
    const userCount = await dashboardPage.getUserCount();
    expect(userCount).toBeGreaterThanOrEqual(3);
  });

  test('should have correct table structure - WILL BREAK with Change #2', async () => {
    // This test uses fragile column count assertion
    const headers = await dashboardPage.getTableHeaders();
    expect(headers).toEqual(UI_TEXT.initial.tableHeaders);
  });

  test('should add new user successfully', async ({ page }) => {
    const userModal = new UserModal(page);
    const initialCount = await dashboardPage.getUserCount();
    
    await dashboardPage.addUserButton.click();
    await userModal.fillForm({
      name: 'Test User',
      email: 'test@example.com',
      role: 'User',
    });
    await userModal.save();
    
    await expect(userModal.modalBackdrop).not.toBeVisible();
    const newCount = await dashboardPage.getUserCount();
    expect(newCount).toBe(initialCount + 1);
  });
});

test.describe('User Modal', () => {
  let dashboardPage: DashboardPage;
  let userModal: UserModal;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    userModal = new UserModal(page);
    await dashboardPage.goto();
  });

  test('should open and close modal with stable selectors', async () => {
    await dashboardPage.addUserButton.click();
    await expect(userModal.modalBackdrop).toBeVisible();
    
    await userModal.cancel();
    await expect(userModal.modalBackdrop).not.toBeVisible();
  });

  test('should have correct modal title - WILL BREAK with Change #3', async () => {
    // This test uses fragile text-based assertion
    await dashboardPage.addUserButton.click();
    await expect(userModal.modalTitle).toHaveText(UI_TEXT.initial.modalTitle);
  });
});

test.describe('End-to-End User Journey', () => {
  test('complete flow: login -> add user -> verify', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const userModal = new UserModal(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(TEST_USERS.login.email, TEST_USERS.login.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Add user
    await dashboardPage.addUserButton.click();
    await userModal.fillForm({
      name: TEST_USERS.newUser.name,
      email: TEST_USERS.newUser.email,
      role: TEST_USERS.newUser.role,
    });
    await userModal.save();
    
    // Verify
    await expect(userModal.modalBackdrop).not.toBeVisible();
    await expect(page.getByText(TEST_USERS.newUser.name)).toBeVisible();
  });
});

