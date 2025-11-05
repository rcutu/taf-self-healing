/**
 * End-to-End Test Flows
 * 
 * Complete user journey tests that span multiple pages.
 */

import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, UserModal, ProfilePage } from './helpers/page-objects';
import { TEST_USERS } from './helpers/test-data';

test.describe('End-to-End User Flows', () => {
  test('complete user journey: login -> add user -> view profile -> logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const userModal = new UserModal(page);
    const profilePage = new ProfilePage(page);
    
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(TEST_USERS.login.email, TEST_USERS.login.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 2: Add a new user
    await dashboardPage.addUserButton.click();
    await userModal.fillForm({
      name: TEST_USERS.newUser.name,
      email: TEST_USERS.newUser.email,
      department: TEST_USERS.newUser.department,
      role: TEST_USERS.newUser.role,
    });
    await userModal.save();
    
    // Verify user was added
    await expect(page.getByText(TEST_USERS.newUser.name)).toBeVisible();
    
    // Step 3: Navigate to profile
    await dashboardPage.profileLink.click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(profilePage.profileTitle).toBeVisible();
    
    // Step 4: Return to dashboard
    await profilePage.dashboardLink.click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 5: Logout
    await dashboardPage.logoutButton.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('user management flow: add -> edit -> delete', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const userModal = new UserModal(page);
    
    await dashboardPage.goto();
    
    const initialCount = await dashboardPage.getUserCount();
    
    // Add user
    await dashboardPage.addUserButton.click();
    await userModal.fillForm({
      name: 'Test User',
      email: 'test.user@example.com',
      role: 'User',
    });
    await userModal.save();
    
    // Wait for modal to close
    await expect(userModal.modalBackdrop).not.toBeVisible();
    
    // Verify added
    let currentCount = await dashboardPage.getUserCount();
    expect(currentCount).toBe(initialCount + 1);
    
    // Edit the last user (ID 4, since we start with 3)
    await dashboardPage.clickEditUser(4);
    await userModal.nameInput.clear();
    await userModal.nameInput.fill('Test User Updated');
    await userModal.save();
    
    // Wait for modal to close
    await expect(userModal.modalBackdrop).not.toBeVisible();
    
    // Verify edit
    await expect(page.getByText('Test User Updated')).toBeVisible();
    
    // Delete user - setup dialog handler before clicking
    page.once('dialog', dialog => dialog.accept());
    await dashboardPage.clickDeleteUser(4);
    
    // Wait for deletion to process
    await page.waitForTimeout(300);
    
    // Verify deleted
    currentCount = await dashboardPage.getUserCount();
    expect(currentCount).toBe(initialCount);
  });

  test('navigation flow: visit all pages and return', async ({ page }) => {
    // Start at login
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    
    // Login to dashboard
    const loginPage = new LoginPage(page);
    await loginPage.login(TEST_USERS.login.email, TEST_USERS.login.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to profile
    await page.getByTestId('profile-link').click();
    await expect(page).toHaveURL(/.*profile/);
    
    // Go back to dashboard
    await page.getByTestId('dashboard-link').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Visit dev tools
    await page.goto('/dev');
    await expect(page).toHaveURL(/.*dev/);
    
    // Return to login
    await page.getByTestId('nav-to-login').click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('persistence flow: changes persist within session', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const userModal = new UserModal(page);
    
    // Add a user
    await dashboardPage.goto();
    await dashboardPage.addUserButton.click();
    await userModal.fillForm({
      name: 'Persistent User',
      email: 'persistent@example.com',
      role: 'Manager',
    });
    await userModal.save();
    
    // Wait for modal to close and verify user was added
    await expect(userModal.modalBackdrop).not.toBeVisible();
    await expect(page.getByText('Persistent User')).toBeVisible();
    
    // Navigate within the app using links (not full page reload)
    await dashboardPage.profileLink.click();
    await expect(page).toHaveURL(/.*profile/);
    
    // Navigate back using links
    await page.getByTestId('dashboard-link').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify user still exists (note: full page reloads reset state)
    await expect(page.getByText('Persistent User')).toBeVisible();
  });
});

test.describe('End-to-End with UI Changes', () => {
  test('complete flow with UI changes (without page reload)', async ({ page }) => {
    // Start at login
    await page.goto('/login');
    
    // Use navigation to go to dev tools (keeps state)
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
    
    // Navigate back to login to verify change #1
    await page.getByTestId('nav-to-login').click();
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login button changed
    const loginButton = page.getByTestId('login-submit');
    await expect(loginButton).toContainText('Log In Now');
    
    // Login with changed button
    await page.getByTestId('email-input').fill(TEST_USERS.login.email);
    await page.getByTestId('password-input').fill(TEST_USERS.login.password);
    await loginButton.click();
    
    // Dashboard (verify department column - change #2)
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId('header-department')).toBeVisible();
    
    // Open modal (verify changed title - change #3)
    await page.getByTestId('add-user-button').click();
    await expect(page.getByTestId('modal-title')).toContainText('Edit Team Member');
    
    // Close modal
    await page.getByTestId('cancel-button').click();
  });

  test('reset flow: apply changes -> reset (within session)', async ({ page }) => {
    // Start at login
    await page.goto('/login');
    
    // Navigate to dev tools
    await page.evaluate(() => {
      window.location.href = '/dev';
    });
    await page.waitForURL('**/dev');
    
    // Apply changes
    await page.getByTestId('apply-change-1').click();
    await page.waitForTimeout(200);
    await page.getByTestId('apply-change-2').click();
    await page.waitForTimeout(200);
    
    // Verify changes are active
    await page.getByTestId('nav-to-login').click();
    await expect(page).toHaveURL(/.*login/);
    
    // Wait for button to be visible and have the correct text
    const loginButton = page.getByTestId('login-submit');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText('Log In Now');
    
    // Go back to dev tools and reset
    await page.evaluate(() => {
      window.location.href = '/dev';
    });
    await page.waitForURL('**/dev');
    await page.getByTestId('reset-changes').click();
    await page.waitForTimeout(200);
    
    // Verify original state
    await page.getByTestId('nav-to-login').click();
    await expect(page).toHaveURL(/.*login/);
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toContainText('Sign In');
    
    // Verify dashboard table also reset
    await page.getByTestId('email-input').fill('test@test.com');
    await page.getByTestId('password-input').fill('pass');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Department column should not be visible
    await expect(page.getByTestId('header-department')).not.toBeVisible();
  });
});

test.describe('Error Handling and Edge Cases', () => {
  test('should handle rapid modal open/close', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open and close multiple times
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('add-user-button').click();
      await expect(page.getByTestId('modal-backdrop')).toBeVisible();
      await page.getByTestId('cancel-button').click();
      await expect(page.getByTestId('modal-backdrop')).not.toBeVisible();
    }
  });

  test('should handle multiple user deletions', async ({ page }) => {
    await page.goto('/dashboard');
    
    const initialCount = await page.locator('[data-testid^="user-row-"]').count();
    
    // Delete first user
    page.once('dialog', dialog => dialog.accept());
    await page.getByTestId('delete-user-1').click();
    await page.waitForTimeout(200);
    
    // Delete second user
    page.once('dialog', dialog => dialog.accept());
    await page.getByTestId('delete-user-2').click();
    await page.waitForTimeout(200);
    
    const finalCount = await page.locator('[data-testid^="user-row-"]').count();
    expect(finalCount).toBe(initialCount - 2);
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Directly navigate to each page
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
    
    await page.goto('/profile');
    await expect(page.getByTestId('profile-title')).toBeVisible();
    
    await page.goto('/dev');
    await expect(page.getByTestId('dev-tools-title')).toBeVisible();
    
    await page.goto('/login');
    await expect(page.getByTestId('login-title')).toBeVisible();
  });
});

