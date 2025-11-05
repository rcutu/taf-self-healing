/**
 * Test Data and Constants
 * 
 * Centralized test data for consistent testing across all test files.
 */

export const TEST_USERS = {
  login: {
    email: 'test@example.com',
    password: 'password123',
  },
  
  existing: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      department: 'IT',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      department: 'Marketing',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Manager',
      department: 'Sales',
    },
  ],

  newUser: {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'User',
    department: 'Engineering',
  },
};

export const UI_TEXT = {
  initial: {
    loginButton: 'Sign In',
    modalTitle: 'User Information',
    tableHeaders: ['Name', 'Email', 'Role', 'Actions'],
  },
  
  afterChange1: {
    loginButton: 'Log In Now',
  },
  
  afterChange2: {
    tableHeaders: ['Name', 'Email', 'Role', 'Department', 'Actions'],
  },
  
  afterChange3: {
    modalTitle: 'Edit Team Member',
  },
};

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile',
  dev: '/dev',
};

