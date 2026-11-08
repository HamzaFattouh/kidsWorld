# KidsWorld - Complete Project Architecture & Context Document

> **Status:** Active Production-Ready Codebase  
> **Repository:** `kidsWorld`  
> **Last Updated:** November 2026  
> **Primary Language / Locale:** Arabic (RTL, First-Class) & English (LTR)

---

## 1. Project Overview & Business Domain

**KidsWorld** is an integrated, full-stack Nursery & Daycare Management Platform connecting Nursery Administrators, Teachers, and Parents into a single real-time ecosystem.

### Target Roles & Core Capabilities
1. **Admins:**
   - Full oversight of nursery branches, classrooms, staff, enrollments, and parents.
   - Real-time camera permissions matrix, schedule enforcement, and camera feed layout controls.
   - CMS management (announcements, events, gallery, public landing page).
   - Operational logs, audit trails, and reporting (attendance, meals, financial metrics).
2. **Teachers:**
   - Daily attendance check-in / check-out.
   - Daily logging: meals, naps, developmental evaluations, weekly notes, and incident tracking.
   - Parent communications and scheduled daily task management.
3. **Parents:**
   - Multi-child dashboard with daily reports, meal updates, and evaluation tracking.
   - Secure live camera viewing during authorized nap/play schedules.
   - Incident alerts, ticketing/inquiries (complaints & requests), and authorized pickup authorization.

---

## 2. Technology Stack & Architectural Patterns

### High-Level Architecture

```
                          ┌────────────────────────────────┐
                          │   Nginx Reverse Proxy / VPS   │
                          └───────┬────────────────┬───────┘
                                  │                │
                       HTTP / API │                │ WebRTC / HLS
                                  ▼                ▼
┌──────────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│   Clients        │    │  Backend API     │    │  Media Server (go2rtc)  │
│ - Web (React 19) ├───►│  (Node/Express)  │    │ - 7 Camera Streams      │
│ - Mobile (Expo)  │◄───┤  - Clean Arch    │◄───┤   (4 Nap + 3 Playroom)  │
└──────────────────┘    │  - Prisma ORM    │    │ - WebRTC / HLS (.m3u8)  │
                        └─────────┬────────┘    └────────────▲────────────┘
                                  │                          │ RTSP
                                  ▼                          │
                        ┌──────────────────┐    ┌────────────┴────────────┐
                        │ Database (Prisma)│    │ IP Cameras / NVR        │
                        └──────────────────┘    └─────────────────────────┘
```

### Backend Architecture (`/backend`)
* **Framework:** Node.js + Express.js.
* **Architecture Pattern:** Clean Architecture with strict separation of concerns:
  - **Routes (`api/v1/` & `routes/`):** Route definitions, HTTP verbs, and path mappings.
  - **Middlewares (`api/middlewares/`):**
    - `sessionValidator.js`: JWT token verification and user extraction.
    - `authorize.js`: RBAC role verification (`ADMIN`, `TEACHER`, `PARENT`).
    - `csrfDefender.js`: Enforces application-level client headers (`x-app-client`).
    - `rateLimiter.js`: Global and route-specific rate limiting (e.g., camera token access limiter).
    - `errorHandler.js`: Centralized error logging and standard error envelopes.
  - **Controllers & DTOs:** Request parsing, validation via Zod, and response formatting.
  - **Services / Use Cases (`services/`):** Pure business logic (e.g., `camera.service.js`, `AuthService.js`, `ChildService.js`).
  - **Repositories (`repositories/`):** Direct database operations and Prisma queries.
  - **Data Layer (`prisma/schema.prisma`):** Relational schema managed by Prisma ORM.

### Web Frontend (`/web`)
* **Framework:** React 19 + Vite.
* **Routing:** `react-router-dom` v7 with role-guarded layout routes (`AdminLayout`, `TeacherLayout`, `ParentLayout`, `PublicLayout`).
* **State Management:**
  - Server State: `@tanstack/react-query` v5 for caching, background revalidation, and mutations.
  - Client State: `zustand` with persistence (migrated to `IndexedDB` for high-capacity media caching and localStorage fallback).
* **Styling:** Tailwind CSS (strict flat design).
* **Internationalization:** `i18next` + `react-i18next` with complete Arabic translations and RTL layout adjustments.
* **Testing:** Vitest (unit/component testing) and Playwright (E2E testing with HTML reports).

### Mobile App (`/mobile`)
* **Framework:** React Native 0.86 with Expo SDK 57.
* **Navigation:** React Navigation v7 (Native Stack + Bottom Tabs).
* **Styling:** NativeWind (Tailwind CSS for React Native).
* **Storage & Security:** `expo-secure-store`, `@react-native-async-storage/async-storage`.
* **Hardware & Features:** `expo-image-picker`, `expo-notifications`, `expo-linking` (deep linking support).

---

## 3. Camera Streaming Subsystem (`go2rtc`)

### Infrastructure & Deployment (`/deploy/go2rtc`)
* **Media Engine:** `go2rtc` (lightweight binary running on Linux VPS).
* **Proxying & Security:** Nginx reverse proxy terminates SSL, handles CORS, and exposes:
  - `POST /api/webrtc`: WebRTC SDP offer/answer signaling.
  - `GET /api/stream.m3u8`: Native HLS stream fallback.
  - Ports: `80/tcp`, `443/tcp` (HTTPS/WSS) and `8555/tcp+udp` (WebRTC media).
  - Cloudflare DNS configuration: **DNS-Only (Grey Cloud)** to allow direct UDP/WSS traffic.

### 7 Nursery Cameras Mapping
1. **`cam1`:** Infant Nap Room (1 Year Old) (`class-sleep-1`)
2. **`cam2`:** Toddler Nap Room (2 Years Old) (`class-sleep-2`)
3. **`cam3`:** Early Preschool Nap Room (3 Years Old) (`class-sleep-3`)
4. **`cam4`:** Preschool Nap Room (4 Years Old) (`class-sleep-4`)
5. **`cam5`:** Playroom - Motor & Movement Zone (`class-playroom-1`)
6. **`cam6`:** Playroom - Cognitive & Skill Games (`class-playroom-2`)
7. **`cam7`:** Playroom - Central Arena (`class-playroom-3`)

### Access & Security Flow
1. Parent/Teacher/Admin requests access via `POST /api/v1/cameras/:id/access`.
2. Backend verifies:
   - User identity & role.
   - Child enrollment in corresponding class.
   - Child check-in status (attendance verified).
   - Active schedule time window (e.g. 11:30 AM – 2:30 PM) unless user is `ADMIN` or has an active admin override grant.
3. Backend returns a short-lived signed token and direct stream URLs (WebRTC endpoint + HLS fallback).
4. Player (`WebRTCPlayer.jsx`) establishes sub-second WebRTC connection; on failure or restricted network, transparently falls back to HLS (`hls.js`).

---

## 4. Design & Branding Constraints

As outlined in `AGENTS.md`, the following rules are non-negotiable:

| Constraint | Implementation Standard |
| :--- | :--- |
| **Icons, NOT Emojis** | Strictly use **Lucide React** (`lucide-react` on web, `lucide-react-native` on mobile). Emojis are strictly banned from UI elements, headers, buttons, and badges. |
| **No Shadows** | Do **NOT** use `box-shadow`, `drop-shadow`, or React Native `elevation`. All containers, modals, buttons, and cards must remain flat, crisp, and modern with clear borders (`border border-slate-200` etc.). |
| **Brand Identity** | Follow constant branding colors: primary brand greens, slate neutrals, clear contrast states, and complete RTL layout symmetry. |

---

## 5. Repository Directory Map

```
kidsWorld/
├── .agents/                      # Workflow definitions & skills
├── backend/                      # Node.js + Express Clean Architecture API
│   ├── api/
│   │   ├── middlewares/          # Auth, RBAC, CSRF, Rate Limiting, Error Handling
│   │   └── v1/                   # Modular controllers, DTOs, and route declarations
│   ├── config/                   # Database, environment, and logger configs
│   ├── controllers/              # Camera & domain controllers
│   ├── core/                     # Prisma singleton instance
│   ├── data/                     # Seed files and test fixtures
│   ├── prisma/                   # schema.prisma & migrations
│   ├── repositories/             # Data access layer (User, Child, Class, Camera, etc.)
│   ├── routes/                   # Feature route groups (camera, cms)
│   ├── services/                 # Business logic and use cases
│   ├── tests/                    # Integration and unit test suites
│   ├── seed_cameras.cjs          # Camera & classroom database seed script
│   └── server.js                 # HTTP server entrypoint
├── deploy/
│   └── go2rtc/                   # go2rtc deployment scripts, systemd, docker, and nginx configs
├── docs/                         # Specifications, ADRs, camera setups, security audits
├── mobile/                       # Expo / React Native mobile application
│   ├── src/
│   │   ├── components/           # Flat mobile UI components (ScreenWrapper, Modals, Cards)
│   │   ├── screens/              # Admin, Teacher, and Parent screens
│   │   ├── services/             # Axios API client, auth & storage tokens
│   │   └── store/                # Mobile Zustand store
├── web/                          # React 19 + Vite web application
│   ├── src/
│   │   ├── api/                  # Axios query services (cameraApi, etc.)
│   │   ├── components/           # Reusable flat UI components & WebRTCPlayer
│   │   ├── layouts/              # Admin, Teacher, Parent, and Public layouts
│   │   ├── pages/                # Admin, Teacher, Parent, and CMS screens
│   │   ├── store/                # Zustand stores with IndexedDB persistence
│   │   └── i18n.js               # Arabic (RTL) & English localization
│   └── tests/                    # Vitest and Playwright E2E suites
├── AGENTS.md                     # Design & branding constraints (Icons only, No Shadows)
└── PROJECT_CONTEXT.md            # This document: Comprehensive context and architecture reference
```

---

## 6. Current State & Verification Checklist

* **Git State:** Clean working tree on `origin/main`.
* **Camera System:** Fully implemented on web and mobile with live multi-camera monitoring, WebRTC/HLS hybrid playback, schedule controls, and user permission matrices.
* **Testing:**
  - Web unit tests passing (`vitest`).
  - Playwright test suites configured for bilingual UI validation.
  - Backend integration tests configured (require live DB instance or mocked repository context).

