# Testing Strategy

## 1. Backend Testing
- **Framework:** Jest + Supertest.
- **Unit Tests:** For isolated business logic (Use Cases, calculations, permission logic).
- **Integration Tests:** For API endpoints. These spin up an in-memory database or a dedicated test MySQL container, seed it, and make requests via Supertest.

## 2. Frontend Web Testing
- **Framework:** Vitest or Jest + React Testing Library.
- Focus on component rendering, state changes, and mocked API interactions.

## 3. Mobile Testing
- **Unit/Component:** Jest + React Native Testing Library.
- **E2E (End-to-End):** Detox for automated interaction testing on iOS simulators and Android emulators.

## 4. Continuous Integration (CI)
GitHub Actions / GitLab CI will run:
1. Linting and Formatting (ESLint, Prettier).
2. Type checking (TypeScript).
3. Backend unit and integration tests.
4. Frontend unit tests.
Only branches that pass CI can be merged into `main`.
