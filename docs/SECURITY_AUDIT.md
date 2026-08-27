# Security Audit Report

**Date**: 2026-08-27
**Scope**: Entire Codebase (Express API, Prisma, Mobile structures, Routes)
**Baseline**: OWASP Top 10

## Executive Summary
The KidsWorld backend establishes a solid security foundation with role-based access control, JWT session invalidation, and custom ownership middlewares. Database interactions rely fully on Prisma ORM, virtually eliminating SQL Injection risks. Recent audit logging implementations successfully scrub sensitive data. 

However, critical vulnerabilities exist around session management (missing middleware) and insufficient brute-force protections on authentication routes.

---

## Detailed Findings

### 1. SEC-001: Broken Session Management (Missing Cookie Parser)
- **Severity**: High (OWASP A07:2021-Identification and Authentication Failures)
- **Location**: `src/app.ts`, `src/api/middlewares/sessionValidator.ts`
- **Vulnerability**: The application issues JWTs as HTTP-only cookies in `auth.controller.ts`, but fails to mount `cookie-parser` in `app.ts`. Consequently, `req.cookies` evaluates to `undefined`, breaking cookie-based authentication for web clients and breaking `logout` functionality which relies on reading the cookie to revoke the session hash.
- **Exploit Scenario**: Web clients cannot authenticate using cookies. If forced to store JWTs in `localStorage` to pass via headers, they become vulnerable to Cross-Site Scripting (XSS) token theft.
- **Impact**: Breaking authentication flows; potential downgrade to less secure token storage.
- **Recommended Fix**: Add `app.use(cookieParser())` to `src/app.ts`.

### 2. SEC-002: Insufficient Rate Limiting on Authentication (Brute Force)
- **Severity**: Medium (OWASP A07:2021-Identification and Authentication Failures)
- **Location**: `src/api/v1/auth/auth.routes.ts`, `src/app.ts`
- **Vulnerability**: The global rate limiter (`apiLimiter`) restricts IPs to 100 requests per 15 minutes. This is too generous for the `/login` and `/forgot-password` routes, allowing a slow, distributed brute-force or credential stuffing attack.
- **Exploit Scenario**: An attacker scripts a bot to try 90 passwords per IP every 15 minutes against a known teacher email, evading the global rate limit.
- **Impact**: Account takeover for weak passwords.
- **Recommended Fix**: Implement a dedicated `authLimiter` (e.g., 5 attempts per 15 minutes) specifically mounted on the `POST /login` and `POST /forgot-password` routes.

### 3. SEC-003: Weak Password Complexity Enforcement
- **Severity**: Medium (OWASP A07:2021-Identification and Authentication Failures)
- **Location**: `src/api/v1/auth/auth.controller.ts` (Zod Schemas)
- **Vulnerability**: The `loginSchema` and registration logic only validate that a password is `z.string().min(1)`. There is no enforcement of length, entropy, or complexity.
- **Exploit Scenario**: Users create accounts with the password "123", drastically reducing the time required for an attacker to successfully brute-force an account.
- **Impact**: Account takeover.
- **Recommended Fix**: Update Zod schemas to enforce `z.string().min(8)` with regex requirements for numbers and special characters on password creation and reset.

### 4. SEC-004: Lack of CSRF Protection for Cookie Sessions
- **Severity**: Low/Medium (OWASP A01:2021-Broken Access Control)
- **Location**: `src/api/v1/auth/auth.controller.ts`
- **Vulnerability**: The application relies entirely on `sameSite: 'strict'` to prevent Cross-Site Request Forgery (CSRF). While generally effective in modern browsers, older browser versions or subdomain takeovers (if the API and App share a root domain) can bypass this.
- **Exploit Scenario**: An attacker hosts a malicious site. An older browser connects, and the attacker initiates a POST request to `/api/v1/communication/complaints` using the victim's session.
- **Impact**: Unauthorized actions performed on behalf of a parent or teacher.
- **Recommended Fix**: If web clients are the primary consumer of cookies, implement a double-submit CSRF token (e.g., `csurf` middleware) or require a custom header like `X-Requested-With` on all state-changing API requests.

### 5. SEC-005: File Upload & Path Traversal Risks (Not Implemented Yet)
- **Severity**: Informational
- **Location**: Document Management (Planned)
- **Vulnerability**: While not currently exploitable, the specification calls for "Document Management." 
- **Recommended Fix**: Ensure future implementations use UUIDs for filenames (no user-controlled filenames), strict MIME-type validation, and store files outside the public web root (preferably in S3 with presigned URLs).

### 6. SEC-006: Server-Side Request Forgery (SSRF) in Camera Proxying
- **Severity**: Informational / Low
- **Location**: `src/services/camera.service.ts`
- **Vulnerability**: The camera service currently issues tokens for an external Media Server. If the media server's internal address or RTSP streams are ever directly queried or proxied through the Express backend in the future, it must validate the internal IPs.
- **Recommended Fix**: Ensure the Node.js backend NEVER proxies raw video streams itself. Rely strictly on the signed JWT hand-off to the dedicated media server.

## Mitigated Risks (Working as Intended)
- **SQL Injection**: Fully mitigated via Prisma parameterized queries. No raw queries (`$queryRaw`) exist.
- **IDOR (Insecure Direct Object Reference)**: Correctly mitigated via the `requireOwnership` middleware which strictly validates child/class relationships via `AuthzService`.
- **Sensitive Data Exposure in Logs**: Mitigated by the recursive `AuditService` data scrubber implemented in the previous phase.
