# Test Automation Framework - Self-Healing Validation

Playwright E2E test suite designed to validate AI-powered self-healing test capabilities.

## Purpose

This framework demonstrates:
- **Fragile test patterns** that break with UI changes
- **Stable test patterns** using reliable selectors
- **Real-world UI change scenarios** for healing validation
- **GitHub Actions CI/CD** integration

## Quick Start

### Prerequisites
- Node.js 18+
- Angular app running at `http://localhost:4200`

### Installation & Run

```bash
npm install
npx playwright install

# Run all tests
npm test

# Run with UI (recommended for debugging)
npm run test:ui

# Run specific tests
npm run test:core
npm run test:healing
```

## Project Structure

```
tests/
├── helpers/
│   ├── page-objects.ts      # Page Object Models
│   └── test-data.ts          # Test data & constants
├── core-functionality.spec.ts    # Essential app tests
├── healing-scenarios.spec.ts     # Self-healing demos
└── 06-e2e-flows.spec.ts         # End-to-end flows
```

## Test Categories

### Core Functionality (7 tests per browser = 21 total)
Essential tests covering main features:
- Login flow
- Dashboard operations
- User CRUD
- Modal interactions

**Key**: Mix of stable (data-testid) and fragile (text/structure) selectors

### Healing Scenarios (8 tests per browser = 24 total)
Demonstrates selector stability:
- **FRAGILE**: Text content, column count, nth-child
- **STABLE**: data-testid, specific test IDs

### E2E Flows (9 tests per browser = 27 total)
Complete user journeys testing integrated features

## Self-Healing Test Strategy

### Scenario 1: Button Text Change
**Change**: Login button "Sign In" → "Log In Now"

```typescript
// FRAGILE - Will break
page.getByText('Sign In')

// STABLE - Won't break
page.getByTestId('login-submit')
```

**Expected Failures**: 1 test per browser (3 total)
**Healing Action**: Update text assertions or switch to data-testid

### Scenario 2: Table Column Addition
**Change**: Add "Department" column to user table

```typescript
// FRAGILE - Will break
page.locator('thead th').toHaveCount(4)

// STABLE - Won't break
page.getByTestId('header-name')
```

**Expected Failures**: 2 tests per browser (6 total)
**Healing Action**: Update column count or use specific column selectors

### Scenario 3: Modal Title Change
**Change**: Modal title "User Information" → "Edit Team Member"

```typescript
// FRAGILE - Will break
page.getByText('User Information')

// STABLE - Won't break
page.getByTestId('modal-title')
```

**Expected Failures**: 1 test per browser (3 total)
**Healing Action**: Update text assertion or use testid

## Testing Workflow

### 1. Baseline Run
```bash
npm test
# All tests should pass
```

### 2. Apply UI Change
Visit `http://localhost:4200/dev` and click a change button

### 3. Verify Failures
```bash
npm test
# Some tests will fail
```

### 4. Enable AI Healing
Run your AI healing system to analyze and fix failures

### 5. Verify Healing
```bash
npm test
# Tests should pass again
```

### 6. Reset & Repeat
Visit `/dev` and click "Reset All Changes"

## GitHub Actions CI/CD

Tests run automatically on:
- Push to main/master/develop
- Pull requests
- Manual trigger

View results: **Actions** tab in GitHub

### Workflow Configuration
`.github/workflows/playwright.yml`
- Runs on Ubuntu latest
- Tests all browsers (Chromium, Firefox, WebKit)
- Uploads test reports and videos
- 30-day retention for reports

## Available Commands

```bash
# Run all tests
npm test

# Run with UI mode (best for development)
npm run test:ui

# Run in headed browsers
npm run test:headed

# Run in debug mode
npm run test:debug

# Run specific test files
npm run test:core          # Core functionality
npm run test:healing       # Healing scenarios
npm run test:e2e           # E2E flows

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View test report
npm run report

# Generate new tests (record interactions)
npm run codegen
```

## Page Object Models

### LoginPage
```typescript
await loginPage.goto();
await loginPage.login(email, password);
```

### DashboardPage
```typescript
await dashboardPage.goto();
await dashboardPage.addUserButton.click();
const count = await dashboardPage.getUserCount();
```

### UserModal
```typescript
await userModal.fillForm({ name, email, role });
await userModal.save();
```

## Expected Test Results

### Initial State (No UI Changes)
- All tests pass (~72 tests)
- No failures

### After Change #1 (Login Button)
- ~69 tests pass
- 3 tests fail (text-based selectors)

### After Change #2 (Table Column)
- ~66 tests pass
- 6 tests fail (column count/index)

### After Change #3 (Modal Title)
- ~69 tests pass
- 3 tests fail (text content)

### After All Changes
- ~60 tests pass
- ~12 tests fail (multiple issues)

### After AI Healing
- All tests pass
- Self-healing successfully adapted tests

## Test Design Principles

### Good Practices
- Use data-testid for stable elements
- Use Page Object Models
- Centralize test data
- Clear test descriptions
- Meaningful assertions

### Anti-Patterns (Intentional for Demo)
- Text content selectors
- nth-child/index-based selectors
- Hard-coded counts
- Coupling to UI structure

## Debugging

### Failed Test
```bash
npm run test:debug
```

### View Trace
```bash
npx playwright show-trace test-results/.../trace.zip
```

### Screenshots
Automatically captured on failure in `test-results/`

## Documentation

- **README.md** (this file) - Main documentation
- **playwright.config.ts** - Configuration
- **.github/workflows/playwright.yml** - CI/CD pipeline

## Contributing

1. Fork the repository
2. Create feature branch
3. Write/update tests
4. Ensure all tests pass
5. Submit pull request

## Metrics

- **Total Tests**: 72 (across 3 browsers)
- **Page Objects**: 5
- **Test Files**: 3
- **Browsers**: 3 (Chromium, Firefox, WebKit)
- **CI/CD**: GitHub Actions
- **Coverage**: Login, Dashboard, CRUD, Navigation

## Related

- Angular App: `../dummy-qa-poc`
- Dev Tools: `http://localhost:4200/dev`
- [Playwright Docs](https://playwright.dev/)

## License

MIT

---

Ready for self-healing validation.
