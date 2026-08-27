# Verify Workflow

This workflow ensures all code changes meet the quality, security, and architectural standards of the nursery management platform. Always run this workflow to validate your implementations before claiming success.

## Verification Steps

1. **Read Specifications:** Read the relevant specification and architecture documents (`docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`) to ensure the implementation aligns with the agreed design.
2. **Inspect Changes:** Inspect the changed files to understand the scope and impact of the modifications.
3. **Run Formatting/Linting:** Execute the project's linter and formatter to ensure code style consistency.
4. **Run Type Checking:** Execute TypeScript compilation or type-checking scripts to catch type errors.
5. **Run Unit Tests:** Execute the unit test suite for the affected components and modules.
6. **Run Integration Tests:** Where applicable, run integration tests to verify interactions between services and the database.
7. **Run Security Tests:** Run tests specifically targeting security-sensitive behavior (e.g., authorization rules, RBAC checks, camera access logic).
8. **Start Application:** If required by the changes, start the application locally to verify it boots successfully.
9. **Run Browser Tests:** If web UI changes were made, run automated browser tests (e.g., E2E tests via Detox/Playwright/Cypress).
10. **Fix Issues:** Fix *only* the failures and errors that were caused by the current implementation. Do not arbitrarily change unrelated code.
11. **Re-run Verification:** If any fixes were made in step 10, repeat the necessary verification steps to ensure the fix is solid and didn't break anything else.
12. **Report Results:** Report to the user *exactly* what passed and what failed, providing terminal output snippets or clear evidence.
13. **Evidence-Based Success:** Never claim success without verifiable evidence that the code builds, tests pass, and functionality works as expected.
