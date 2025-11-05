/**
 * Page Object Models for the Dummy QA App
 * 
 * These POMs provide a clean interface for interacting with pages,
 * making tests more maintainable and easier to heal when UI changes.
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit');
    this.loginTitle = page.getByTestId('login-title');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getSubmitButtonText(): Promise<string> {
    return await this.submitButton.textContent() || '';
  }
}

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly addUserButton: Locator;
  readonly userTable: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByTestId('dashboard-title');
    this.addUserButton = page.getByTestId('add-user-button');
    this.userTable = page.getByTestId('user-table');
    this.profileLink = page.getByTestId('profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async getUserRow(userId: number): Promise<Locator> {
    return this.page.getByTestId(`user-row-${userId}`);
  }

  async clickEditUser(userId: number) {
    await this.page.getByTestId(`edit-user-${userId}`).click();
  }

  async clickDeleteUser(userId: number) {
    // Note: Dialog must be handled by the test before calling this method
    // Use: page.once('dialog', dialog => dialog.accept());
    await this.page.getByTestId(`delete-user-${userId}`).click();
  }

  async getUserCount(): Promise<number> {
    const rows = this.page.locator('[data-testid^="user-row-"]');
    return await rows.count();
  }

  async getTableHeaders(): Promise<string[]> {
    const headers = this.page.locator('thead th');
    const count = await headers.count();
    const headerTexts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await headers.nth(i).textContent();
      headerTexts.push(text?.trim() || '');
    }
    
    return headerTexts;
  }
}

export class UserModal {
  readonly page: Page;
  readonly modalBackdrop: Locator;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly departmentInput: Locator;
  readonly roleSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalBackdrop = page.getByTestId('modal-backdrop');
    this.modalTitle = page.getByTestId('modal-title');
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByTestId('email-input');
    this.departmentInput = page.getByTestId('department-input');
    this.roleSelect = page.getByTestId('role-select');
    this.saveButton = page.getByTestId('save-button');
    this.cancelButton = page.getByTestId('cancel-button');
  }

  async fillForm(data: {
    name: string;
    email: string;
    department?: string;
    role?: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    
    if (data.department) {
      await this.departmentInput.fill(data.department);
    }
    
    if (data.role) {
      await this.roleSelect.selectOption(data.role);
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isVisible(): Promise<boolean> {
    return await this.modalBackdrop.isVisible();
  }

  async getModalTitle(): Promise<string> {
    return await this.modalTitle.textContent() || '';
  }
}

export class ProfilePage {
  readonly page: Page;
  readonly profileTitle: Locator;
  readonly profileName: Locator;
  readonly profileEmail: Locator;
  readonly dashboardLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileTitle = page.getByTestId('profile-title');
    this.profileName = page.getByTestId('profile-name');
    this.profileEmail = page.getByTestId('profile-email');
    this.dashboardLink = page.getByTestId('dashboard-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto() {
    await this.page.goto('/profile');
  }
}

export class DevToolsPage {
  readonly page: Page;
  readonly devToolsTitle: Locator;
  readonly applyChange1Button: Locator;
  readonly applyChange2Button: Locator;
  readonly applyChange3Button: Locator;
  readonly resetChangesButton: Locator;
  readonly changeLog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.devToolsTitle = page.getByTestId('dev-tools-title');
    this.applyChange1Button = page.getByTestId('apply-change-1');
    this.applyChange2Button = page.getByTestId('apply-change-2');
    this.applyChange3Button = page.getByTestId('apply-change-3');
    this.resetChangesButton = page.getByTestId('reset-changes');
    this.changeLog = page.getByTestId('change-log');
  }

  async goto() {
    await this.page.goto('/dev');
  }

  async applyChange1() {
    await this.applyChange1Button.click();
  }

  async applyChange2() {
    await this.applyChange2Button.click();
  }

  async applyChange3() {
    await this.applyChange3Button.click();
  }

  async resetChanges() {
    await this.resetChangesButton.click();
  }

  async getChangeLogText(): Promise<string> {
    return await this.changeLog.textContent() || '';
  }
}

