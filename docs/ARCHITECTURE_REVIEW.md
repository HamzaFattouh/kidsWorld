# Architecture Review

This document provides a critical review of the nursery management platform architecture, identifying gaps, security risks, and scalability concerns based on the current specifications.

## 1. IDOR Risks & Authorization Bottlenecks
- **Severity:** High
- **Problem:** The `SECURITY.md` outlines an ownership-based authorization middleware (e.g., Parents can only access their child's data). However, looking at `DATABASE.md`, tables like `ATTENDANCE`, `EVALUATIONS` (implied), and `CAMERA` do not directly reference the `parent_id` or `user_id`.
- **Why it matters:** To verify if a Parent is authorized to fetch an attendance record, the system must perform a complex JOIN through `CHILD` -> `PARENT_CHILD`. If developers forget to implement this complex join, it leads directly to Insecure Direct Object Reference (IDOR) vulnerabilities where parents can guess IDs and see other children's data.
- **Recommended Solution:** Denormalize slightly or use strict database-level Row-Level Security (RLS) policies. Alternatively, ensure all fetching repositories mandate a contextual `user_id` parameter to guarantee the JOIN is never bypassed.
- **Affected Document(s):** `DATABASE.md`, `SECURITY.md`, `API.md`

## 2. Parent-Branch Multi-Tenancy Flaw
- **Severity:** High
- **Problem:** In `DATABASE.md`, the `USER` table has a direct `branch_id` Foreign Key (`BRANCH ||--o{ USER : has`). 
- **Why it matters:** If a parent has two children attending different branches of the same nursery chain, their single user account cannot be associated with both branches easily without creating duplicate accounts (bad UX).
- **Recommended Solution:** Remove `branch_id` from the `USER` table for Parents. Instead, infer branch access via the `PARENT_CHILD` -> `CHILD` -> `BRANCH` relationship, or introduce a many-to-many `USER_BRANCH` table for staff who float between branches.
- **Affected Document(s):** `DATABASE.md`

## 3. Media Server Scalability & Load Testing
- **Severity:** Critical
- **Problem:** `CAMERA_ARCHITECTURE.md` and `DEPLOYMENT.md` outline a single media server (like MediaMTX) ingesting RTSP and serving HLS. There is no CDN or caching layer mentioned for the HLS fragments.
- **Why it matters:** In a nursery, parents often exhibit "thundering herd" behavior (e.g., everyone logs in at noon to watch lunch). A single media server will quickly exhaust its network bandwidth and CPU if it serves 500+ direct HLS connections.
- **Recommended Solution:** Place a CDN (e.g., Cloudflare, AWS CloudFront) or a caching proxy (Varnish/Nginx) in front of the media server. HLS fragments are static files once generated and are highly cacheable. Also, add Load Testing for the media server in the Testing strategy.
- **Affected Document(s):** `CAMERA_ARCHITECTURE.md`, `DEPLOYMENT.md`, `TESTING.md`

## 4. JWT Token Revocation & Session Management
- **Severity:** Medium
- **Problem:** `SECURITY.md` mentions that tokens are bound to device sessions to allow remote revocation, but `ARCHITECTURE.md` only lists Redis as "Optional".
- **Why it matters:** Stateless JWTs cannot be revoked before they expire unless there is a stateful blocklist or a session registry. If a teacher loses their phone or is terminated, they could retain access until the JWT expires.
- **Recommended Solution:** Make Redis a mandatory component in `ARCHITECTURE.md`. Store a `session_id` in the JWT payload and maintain active sessions in Redis. If a session is deleted from Redis, the API rejects the token.
- **Affected Document(s):** `SECURITY.md`, `ARCHITECTURE.md`

## 5. Privacy and Consent Gaps (Camera Module)
- **Severity:** High (Legal/Compliance)
- **Problem:** `SPEC.md` mentions privacy consent, but the architecture doesn't reflect how this is enforced technically. 
- **Why it matters:** If a parent explicitly revokes consent for their child to be filmed, but the child is in a classroom with a live streaming camera, the nursery is in violation of privacy laws. 
- **Recommended Solution:** The system must include a warning or blocker for teachers. If a child without consent is checked into a classroom with an active camera, the system should either alert the admin/teacher to move the child, or automatically disable the camera stream for that room.
- **Affected Document(s):** `SPEC.md`, `DATABASE.md`, `CAMERA_ARCHITECTURE.md`

## 6. Hardcoded Camera Credentials
- **Severity:** High
- **Problem:** `DATABASE.md` includes `stream_url` in the `CAMERA` table. Often, RTSP URLs contain embedded credentials (e.g., `rtsp://admin:pass@ip:port`). 
- **Why it matters:** Storing plaintext passwords in the database is a security risk. If the DB is compromised, internal network cameras are exposed.
- **Recommended Solution:** Separate credentials from the URL. Store them encrypted in the database or in a secure secret manager (like AWS Secrets Manager), and construct the `stream_url` dynamically only when the media server requests it.
- **Affected Document(s):** `DATABASE.md`, `SECURITY.md`

## 7. Web vs. Mobile Consistency (Deep Linking)
- **Severity:** Low
- **Problem:** `MOBILE.md` specifies deep linking (e.g., `nurseryapp://post/123`). However, `SPEC.md` lists a React Web App.
- **Why it matters:** If an email is sent out with a notification, clicking the link on a phone without the app installed will fail with a custom scheme (`nurseryapp://`). 
- **Recommended Solution:** Implement Universal Links (iOS) and App Links (Android) using standard HTTPS URLs (e.g., `https://app.nursery.com/post/123`). The OS will intercept this if the app is installed, and fall back to the React Web App if it isn't, ensuring a seamless experience.
- **Affected Document(s):** `MOBILE.md`
