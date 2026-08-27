# Security Vulnerability Fix Plan

This document outlines the step-by-step plan to remediate the vulnerabilities discovered during the security audit.

## 1. Fix Broken Session Management (SEC-001)
- **Goal**: Enable Express to correctly parse HTTP-only cookies to ensure web clients can authenticate securely.
- **Actions**:
  1. Open `src/app.ts`.
  2. Import `cookieParser` from `cookie-parser`.
  3. Add `app.use(cookieParser())` before the API routes are initialized (e.g., right after `express.json()`).
  4. Verify that `sessionValidator.ts` can now successfully read `req.cookies.token`.

## 2. Implement Authentication Rate Limiting (SEC-002)
- **Goal**: Prevent brute-force password guessing and credential stuffing.
- **Actions**:
  1. Open `src/api/middlewares/rateLimiter.ts`.
  2. Create a new limiter named `authLimiter`:
     ```typescript
     export const authLimiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 5, // 5 attempts
       message: 'Too many authentication attempts, please try again later',
       standardHeaders: true,
       legacyHeaders: false,
     });
     ```
  3. Open `src/api/v1/auth/auth.routes.ts`.
  4. Mount `authLimiter` onto the `POST /login` and `POST /forgot-password` routes.

## 3. Enforce Strict Password Complexity (SEC-003)
- **Goal**: Ensure users cannot create easily guessable passwords.
- **Actions**:
  1. Open `src/api/v1/auth/auth.controller.ts` (or wherever the `loginSchema` and registration schemas are defined).
  2. Update the `password` Zod validation rule:
     ```typescript
     password: z.string()
       .min(8, 'Password must be at least 8 characters long')
       .regex(/[A-Z]/, 'Password must contain an uppercase letter')
       .regex(/[0-9]/, 'Password must contain a number')
       .regex(/[^A-Za-z0-9]/, 'Password must contain a special character')
     ```
  3. Ensure this schema is applied to password resets as well.

## 4. Strengthen Web CSRF Protections (SEC-004)
- **Goal**: Provide defense-in-depth against Cross-Site Request Forgery for older browsers.
- **Actions**:
  1. *Decision Required*: Since this API supports both Mobile (Bearer tokens) and Web (Cookies), introducing a stateful CSRF token mechanism (like `csurf`) complicates mobile clients unnecessarily.
  2. *Alternative Plan*: Implement a custom header check middleware for all state-changing `POST`, `PUT`, `PATCH`, `DELETE` requests.
     ```typescript
     // Example CSRF Defense-in-depth middleware
     export const requireAppHeader = (req: Request, res: Response, next: NextFunction) => {
       if (req.method !== 'GET' && !req.headers['x-app-client']) {
         return res.status(403).json({ error: 'Missing client verification header' });
       }
       next();
     };
     ```
  3. Ensure the web frontend sets `X-App-Client: Web` on all requests.

## 5. Security Guardrails for Future Document Implementation (SEC-005)
- **Goal**: Prevent malicious file execution and path traversal when Document Management is implemented.
- **Actions**:
  1. Enforce the use of `multer` for memory buffering only.
  2. Ensure the upload controller generates a completely random UUID for the filename before saving to disk or S3.
  3. Validate file `mimetype` and reject executables (`.exe`, `.sh`, `.js`, `.php`).

## 6. Execution Order
1. Apply **SEC-001** (Cookie Parser) immediately, as it restores core functionality.
2. Apply **SEC-002** (Auth Limiting) and **SEC-003** (Password Complexity) concurrently as they both impact the authentication module.
3. Schedule **SEC-004** (CSRF Defense) for the next frontend integration sprint, as it requires coordination with the web client.
