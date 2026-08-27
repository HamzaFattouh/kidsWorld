# Known Issues & Bug Log

## CRITICAL
- **[BUG-001] Backend Test Environment Broken**: The backend unit and integration test suites cannot be executed. `jest` fails to compile the application because `import { PrismaClient } from '@prisma/client'` cannot resolve `PrismaClient` (and associated Prisma Types). The `@prisma/client` package is installed, but `npx prisma generate` fails with `No command registered for generate` since this project appears to rely on an unconfigured or custom Prisma 8 / Prisma Composer setup that lacks backward compatibility for generic tests without heavy stubbing.

## HIGH
- **[BUG-002] Missing Application Source**: Although the prompt indicated the project is "assumed to be feature-complete", the React Web Application (`web/`) and the React Native Mobile Application (`apps/mobile/`) lack any actual feature source code (`src/` directories are essentially empty). End-to-end (E2E) testing tools were configured during the QA setup phase but execution halts immediately as there is no application to test.

## MEDIUM
- **[BUG-003] Massive TypeScript Warnings**: The backend build (`tsc`) completes with `✖ 113 problems (8 errors, 105 warnings)`, primarily `any` type definitions and missing Prisma exports across all repository interfaces.

## LOW
- N/A
