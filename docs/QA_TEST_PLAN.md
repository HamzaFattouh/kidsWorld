# KidsWorld QA Test Plan

## 1. System Discovery & Overview

The KidsWorld system consists of three main components:
1. **Backend**: Node.js, Express, Prisma (MySQL). Found in the root `src/` directory. Tested via Jest and Supertest.
2. **Web Application**: React, Vite, TailwindCSS, Zustand. Found in `web/`. Testing frameworks (Playwright, Vitest) configuration files exist, but packages are not fully installed in `package.json`.
3. **Mobile Application**: React Native (Expo), NativeWind, Zustand. Found in `apps/mobile/`. Testing frameworks (Jest, Detox) are not installed in `package.json`.

### Modules Discovered:
- Authentication & Authorization
- Parent & Teacher Dashboards
- Children & Classes Management
- Attendance, Meals, Activities, Notes, Evaluations, Incidents
- Communications (Messaging, Notifications, Announcements)
- Media & Camera Streams
- CMS & Public Website

## 2. Environment & Tools Requirements

### Required Installs before Testing
- `web`: Install `@playwright/test`, `vitest`, `@testing-library/react`.
- `apps/mobile`: Install `jest`, `@testing-library/react-native`, `detox`.
- **Backend Setup**: A separate `test` MySQL database is required to prevent data contamination.
- **Mobile Emulators**: iOS Simulator (e.g., iPhone 15) and Android Emulator (e.g., Pixel 5 API 33) must be configured and running for Detox.

## 3. Test Strategy Execution Plan

1. **Test Environment Preparation**: Seed a clean test database with Admin, Teacher (A/B), Parent (A/B), and Children (A/B/C) fixtures.
2. **Static Verification**: Run `tsc`, `oxlint`, and `eslint` across all workspaces to catch glaring type and syntax errors.
3. **Backend API Testing**: Execute comprehensive unit and integration tests against the backend (`npm run test -- security` already passing, need to expand to functional endpoints).
4. **Security & Authorization Testing**: Validate that RBAC (Role-Based Access Control) strictly prohibits cross-parent/cross-teacher access.
5. **Web E2E Testing**: Spin up the Vite dev server and run Playwright tests covering critical paths for all 3 user roles.
6. **Mobile E2E Testing**: Build debug versions of the Expo app (`npx expo run:ios`, `npx expo run:android`) and execute Detox suites to verify mobile navigation and UX.

## 4. Reporting
Results will be collected and classified by severity (CRITICAL, HIGH, MEDIUM, LOW) into:
- `docs/FINAL_QA_REPORT.md`
- `docs/TEST_RESULTS.md`
- `docs/SECURITY_TEST_RESULTS.md`
- `docs/KNOWN_ISSUES.md`
