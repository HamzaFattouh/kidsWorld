# Graph Report - kidsWorld  (2026-11-08)

## Corpus Check
- 436 files · ~280,220 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 9, .conf 2, .css 2)

## Summary
- 3174 nodes · 5011 edges · 202 communities (154 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51ac9525`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api
- src/App.jsx
- mobile/package.json
- Button
- PageHeader
- api
- MainTabs.jsx
- ref_react
- Hardening Controls
- Hardening Controls
- Modal
- Final QA & Release Report
- backend
- backend/package.json
- steps
- expo
- Code Review and Quality
- Test-Driven Development
- Code Review and Quality
- Test-Driven Development
- web/package.json
- Context Engineering
- Context Engineering
- generate.js
- services/api.js
- Git Workflow and Versioning
- Optimization Patterns
- Git Workflow and Versioning
- Optimization Patterns
- devDependencies
- Shipping and Launch
- Shipping and Launch
- API and Interface Design
- Browser Testing with DevTools
- Frontend UI Engineering
- API and Interface Design
- Browser Testing with DevTools
- Frontend UI Engineering
- CI/CD and Automation
- Constraint-Driven Development
- Deprecation and Migration
- CI/CD and Automation
- Constraint-Driven Development
- Deprecation and Migration
- prisma.js
- Documentation and ADRs
- Incremental Implementation
- Documentation and ADRs
- Incremental Implementation
- streams
- Code Simplification
- Debugging and Error Recovery
- Code Simplification
- Debugging and Error Recovery
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- ScreenWrapper.jsx
- services
- Documentation Commands
- Interview Me
- Planning and Task Breakdown
- Documentation Commands
- Interview Me
- Planning and Task Breakdown
- ReOrder: Keep Your Regulars Ordering Direct
- Idea Refine
- ReOrder: Keep Your Regulars Ordering Direct
- Idea Refine
- authorize.js
- AuthzRepository
- AppError.js
- Doubt-Driven Development
- Strix Cloud (managed, no local infra)
- Process
- Doubt-Driven Development
- Strix Cloud (managed, no local infra)
- Process
- AuthzService
- authorization.test.js
- admin/CamerasPage.jsx
- Using Agent Skills
- Using Agent Skills
- app.js
- @prisma/client
- go2rtc
- KidsWorld - Complete Project Architecture & Context Document
- Spec-Driven Development
- Spec-Driven Development
- Source-Driven Development
- Source-Driven Development
- seed_data.cjs
- Final Engineering Review
- helpers.js
- Documentation Lookup
- Refinement & Evaluation Criteria
- Documentation Lookup
- Refinement & Evaluation Criteria
- PersistentStore
- @vitejs/plugin-react
- main.jsx
- .agents/skills/penetration-testing-with-strix/SKILL.md
- mcp.json
- .antigravity/skills/penetration-testing-with-strix/SKILL.md
- env.js
- cms/cms.controller.js
- ReportingService
- CameraService
- CmsService
- KidsWorld Production Deployment Guide
- Nursery Management Platform Specification
- scripts
- users.controller.js
- CameraController
- CmsRepository
- OperationsRepository
- API Specification
- Performance Audit Report
- Detailed Findings
- Ideation Frameworks Reference
- Ideation Frameworks Reference
- auth.controller.js
- reporting.controller.js
- prisma.js
- AuthService
- CommunicationService
- NotificationService
- Architecture Review
- دليل إعداد وتشغيل بيئة البث المباشر للكاميرات (WebRTC & go2rtc)
- How to Fetch Documentation
- How to Fetch Documentation
- communication.controller.js
- notifications.controller.js
- operations.controller.js
- CommunicationRepository
- ReportingRepository
- OperationsService
- Architecture Decisions Record (ADR)
- Security Vulnerability Fix Plan
- 21st.dev UI Skill
- .agents/skills/ci-security-scanning-with-strix/SKILL.md
- Find security vulnerabilities in code
- 21st.dev UI Skill
- .antigravity/skills/ci-security-scanning-with-strix/SKILL.md
- Find security vulnerabilities in code
- AuthService.js
- ChildService
- Deployment Strategy
- Implementation Plan
- Mobile Architecture (React Native)
- Notifications System
- Security-test an API
- Application security testing
- Fix Strix findings and verify
- Test against the OWASP Top 10
- Pentest a web application
- Security-test an API
- Application security testing
- Fix Strix findings and verify
- Test against the OWASP Top 10
- Pentest a web application
- ChildRepository
- OperationsRepository.js
- ClassService
- Camera & Media Architecture
- Security & Authorization
- Testing Strategy
- seed_cameras.cjs
- .oxlintrc.json
- .agents/skills/constraint-driven-development/scripts/quality-gate.mjs
- routes.js
- auth.test.js
- scripts
- i18n.js
- cms.test.js
- notifications.test.js
- System Architecture
- Database Architecture
- MainTabs.jsx
- React + TypeScript + Vite
- Verify Workflow
- AGENTS.md
- .agents/skills/idea-refine/scripts/idea-refine.sh
- .antigravity/skills/idea-refine/scripts/idea-refine.sh
- setup-vps.sh
- mobile/AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `PageHeader()` - 111 edges
2. `ScreenWrapper()` - 85 edges
3. `Button` - 77 edges
4. `App()` - 72 edges
5. `Card()` - 67 edges
6. `CardContent()` - 64 edges
7. `Modal()` - 57 edges
8. `Input` - 52 edges
9. `react-native` - 48 edges
10. `api` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Optimization: Missing Pagination for High-Volume Endpoints` --references--> `CommunicationRepository`  [INFERRED]
  docs/PERFORMANCE_AUDIT.md → backend/repositories/CommunicationRepository.js
- `Optimization: Missing Pagination for High-Volume Endpoints` --references--> `ReportingRepository`  [INFERRED]
  docs/PERFORMANCE_AUDIT.md → backend/repositories/ReportingRepository.js
- `4. Technical Debt & Inconsistencies` --references--> `AuthService`  [INFERRED]
  docs/FINAL_ENGINEERING_REVIEW.md → backend/services/AuthService.js
- `5. Security Concerns` --references--> `AuthzService`  [INFERRED]
  docs/FINAL_ENGINEERING_REVIEW.md → backend/services/AuthzService.js
- `Mitigated Risks (Working as Intended)` --references--> `AuthzService`  [INFERRED]
  docs/SECURITY_AUDIT.md → backend/services/AuthzService.js

## Import Cycles
- None detected.

## Communities (202 total, 48 thin omitted)

### Community 0 - "api"
Cohesion: 0.10
Nodes (17): announcementApi, attendanceRecordApi, authorizedPickupApi, cameraScheduleApi, classApi, complaintApi, evaluationApi, eventApi (+9 more)

### Community 1 - "src/App.jsx"
Cohesion: 0.06
Nodes (64): AnnouncementsPage, App(), AttendancePage, AuditLogsPage, CameraPermissionsPage, CameraSchedulesPage, CamerasPage, ChildDetailsPage (+56 more)

### Community 2 - "mobile/package.json"
Cohesion: 0.04
Nodes (70): dependencies, axios@^1.20.0, expo-constants@~57.0.18, expo-device@~57.0.2, expo-linking@~57.0.10, expo-notifications@~57.0.18, expo-secure-store@~57.0.4, expo-status-bar@~57.0.1 (+62 more)

### Community 3 - "Button"
Cohesion: 0.10
Nodes (45): @hookform/resolvers, react-hook-form, AnnouncementForm(), schema, AttendanceForm(), schema, CameraForm(), schema (+37 more)

### Community 4 - "PageHeader"
Cohesion: 0.15
Nodes (31): Card(), CardContent(), PageHeader(), AuditLogsPage(), DashboardPage(), DocumentsPage(), FormsPage(), NotificationsPage() (+23 more)

### Community 5 - "api"
Cohesion: 0.12
Nodes (25): Web Frontend (`/web`), lucide-react, react-router-dom, ProtectedRoute(), NotificationDropdown(), ScrollyVideo(), ThemeToggle(), AuthLayout() (+17 more)

### Community 6 - "MainTabs.jsx"
Cohesion: 0.09
Nodes (27): Stack, Tab, AttendanceScreen(), styles, ChildrenScreen(), styles, ComplaintsScreen(), styles (+19 more)

### Community 7 - "ref_react"
Cohesion: 0.08
Nodes (33): ScreenWrapper(), resources, Stack, Tab, ActivitiesScreen(), styles, AttendanceScreen(), styles (+25 more)

### Community 8 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 9 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 10 - "Modal"
Cohesion: 0.13
Nodes (26): childApi, usersApi, ChildForm(), UserForm(), DataTable, Modal(), CameraSchedulesPage(), ChildDetailsPage() (+18 more)

### Community 11 - "Final QA & Release Report"
Cohesion: 0.06
Nodes (29): 1. Executive Summary, 2. Release Decision, 3. Test Environment & Execution Details, 4. High-Level Metrics, 5. Defect Summary, 6. Recommended Next Actions, Associated Documentation, Final QA & Release Report (+21 more)

### Community 12 - "backend"
Cohesion: 0.07
Nodes (31): build, depends_on, environment, ports, restart, context, dockerfile, environment (+23 more)

### Community 13 - "backend/package.json"
Cohesion: 0.07
Nodes (37): dependencies, cookie-parser@^1.4.7, cors@^2.8.6, dotenv@^17.4.2, express@^5.2.1, express-rate-limit@^8.6.2, firebase-admin@^14.3.0, helmet@^8.3.0 (+29 more)

### Community 14 - "steps"
Cohesion: 0.09
Nodes (31): if, needs, runs-on, steps, DATABASE_URL, JWT_SECRET, jobs, build-images (+23 more)

### Community 15 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, adaptiveIcon, googleServicesFile, intentFilters, package, expo, android (+22 more)

### Community 16 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 17 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 18 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 19 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 20 - "web/package.json"
Cohesion: 0.09
Nodes (29): clsx, hls.js, tailwind-merge, dependencies, axios@^1.20.0, clsx@^2.1.1, hls.js@^1.7.4, @hookform/resolvers@^5.9.1 (+21 more)

### Community 21 - "Context Engineering"
Cohesion: 0.07
Nodes (28): Anti-Patterns, Common Rationalizations, Compress before dropping, Confusion Management, Context Budget Management, Context Engineering, Context Packing Strategies, Level 1: Rules Files (+20 more)

### Community 22 - "Context Engineering"
Cohesion: 0.07
Nodes (28): Anti-Patterns, Common Rationalizations, Compress before dropping, Confusion Management, Context Budget Management, Context Engineering, Context Packing Strategies, Level 1: Rules Files (+20 more)

### Community 23 - "generate.js"
Cohesion: 0.08
Nodes (15): baseDir, fs, parentScreens, path, baseDir, fs, path, teacherScreens (+7 more)

### Community 24 - "services/api.js"
Cohesion: 0.10
Nodes (20): expo-image-picker@~57.0.20, AnnouncementsScreen(), styles, EventsScreen(), styles, GalleryScreen(), styles, PostsScreen() (+12 more)

### Community 25 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 26 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 27 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 28 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 29 - "devDependencies"
Cohesion: 0.10
Nodes (20): autoprefixer, jsdom, oxlint, @tailwindcss/postcss, @testing-library/jest-dom, @testing-library/react, vitest, devDependencies (+12 more)

### Community 30 - "Shipping and Launch"
Cohesion: 0.08
Nodes (25): Accessibility, Code Quality, Common Rationalizations, Documentation, Error Budget Release Gate, Error Reporting, Feature Flag Strategy, Infrastructure (+17 more)

### Community 31 - "Shipping and Launch"
Cohesion: 0.08
Nodes (25): Accessibility, Code Quality, Common Rationalizations, Documentation, Error Budget Release Gate, Error Reporting, Feature Flag Strategy, Infrastructure (+17 more)

### Community 32 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 33 - "Browser Testing with DevTools"
Cohesion: 0.08
Nodes (24): Accessibility Verification with DevTools, Available Tools, Browser Testing with DevTools, Clean Console Standard, Common Rationalizations, Console Analysis Patterns, Content Boundary Markers, For Network Issues (+16 more)

### Community 34 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 35 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 36 - "Browser Testing with DevTools"
Cohesion: 0.08
Nodes (24): Accessibility Verification with DevTools, Available Tools, Browser Testing with DevTools, Clean Console Standard, Common Rationalizations, Console Analysis Patterns, Content Boundary Markers, For Network Issues (+16 more)

### Community 37 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 38 - "CI/CD and Automation"
Cohesion: 0.08
Nodes (23): Automation Beyond CI, Basic CI Pipeline, Build Cop Role, CI/CD and Automation, CI Optimization, Common Rationalizations, Dependabot / Renovate, Deployment Strategies (+15 more)

### Community 39 - "Constraint-Driven Development"
Cohesion: 0.08
Nodes (22): Adapting it, Contract, Floor guard: reference implementation, Reference (Node, ~stack-agnostic patterns), Common Rationalizations, Constraint-Driven Development, Escalation Path, Loading Constraints (+14 more)

### Community 40 - "Deprecation and Migration"
Cohesion: 0.08
Nodes (23): Adapter Pattern, Code Is a Liability, Common Rationalizations, Compulsory vs Advisory Deprecation, Core Principles, Database Schema Migrations (Expand/Contract), Deprecation and Migration, Deprecation Planning Starts at Design Time (+15 more)

### Community 41 - "CI/CD and Automation"
Cohesion: 0.08
Nodes (23): Automation Beyond CI, Basic CI Pipeline, Build Cop Role, CI/CD and Automation, CI Optimization, Common Rationalizations, Dependabot / Renovate, Deployment Strategies (+15 more)

### Community 42 - "Constraint-Driven Development"
Cohesion: 0.08
Nodes (22): Adapting it, Contract, Floor guard: reference implementation, Reference (Node, ~stack-agnostic patterns), Common Rationalizations, Constraint-Driven Development, Escalation Path, Loading Constraints (+14 more)

### Community 43 - "Deprecation and Migration"
Cohesion: 0.08
Nodes (23): Adapter Pattern, Code Is a Liability, Common Rationalizations, Compulsory vs Advisory Deprecation, Core Principles, Database Schema Migrations (Expand/Contract), Deprecation and Migration, Deprecation Planning Starts at Design Time (+15 more)

### Community 44 - "prisma.js"
Cohesion: 0.12
Nodes (8): DB_FILE, dbStore, fs, INITIAL_DATA, path, SEED_CAMERAS, cameraService, prisma

### Community 45 - "Documentation and ADRs"
Cohesion: 0.09
Nodes (22): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+14 more)

### Community 46 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 47 - "Documentation and ADRs"
Cohesion: 0.09
Nodes (22): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+14 more)

### Community 48 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 49 - "streams"
Cohesion: 0.09
Nodes (22): api, base_path, listen, origin, log, api, level, rtsp (+14 more)

### Community 50 - "Code Simplification"
Cohesion: 0.09
Nodes (21): 1. Preserve Behavior Exactly, 2. Follow Project Conventions, 3. Prefer Clarity Over Cleverness, 4. Maintain Balance, 5. Scope to What Changed, Code Simplification, Common Rationalizations, Language-Specific Guidance (+13 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "Code Simplification"
Cohesion: 0.09
Nodes (21): 1. Preserve Behavior Exactly, 2. Follow Project Conventions, 3. Prefer Clarity Over Cleverness, 4. Maintain Balance, 5. Scope to What Changed, Code Simplification, Common Rationalizations, Language-Specific Guidance (+13 more)

### Community 53 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 54 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 55 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 56 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 57 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 58 - "ScreenWrapper.jsx"
Cohesion: 0.17
Nodes (13): App(), Stack, styles, expo@^57.0.22, styles, linkingConfig, prefix, MainTabs() (+5 more)

### Community 59 - "services"
Cohesion: 0.10
Nodes (19): generateValue, key, sync, value, destination, source, type, services (+11 more)

### Community 60 - "Documentation Commands"
Cohesion: 0.11
Nodes (16): Authentication, Documentation Commands, Result fields, Search All Libraries, Selection process, Step 1: Resolve a Library, Step 2: Query Documentation, Version-specific IDs (+8 more)

### Community 61 - "Interview Me"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Example, Interaction with Other Skills, Interview Me, Loading Constraints, Output, Overview, Red Flags (+10 more)

### Community 62 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 63 - "Documentation Commands"
Cohesion: 0.11
Nodes (16): Authentication, Documentation Commands, Result fields, Search All Libraries, Selection process, Step 1: Resolve a Library, Step 2: Query Documentation, Version-specific IDs (+8 more)

### Community 64 - "Interview Me"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Example, Interaction with Other Skills, Interview Me, Loading Constraints, Output, Overview, Red Flags (+10 more)

### Community 65 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 66 - "ReOrder: Keep Your Regulars Ordering Direct"
Cohesion: 0.11
Nodes (17): Example 1: Vague Early-Stage Concept (Full 3-Phase Session), Example 2: Feature Idea Within an Existing Product (Codebase-Aware), Example 3: Process/Workflow Idea (Non-Product), Ideation Session Examples, Key Assumptions to Validate, MVP Scope, Not Doing (and Why), Open Questions (+9 more)

### Community 67 - "Idea Refine"
Cohesion: 0.11
Nodes (17): Anti-patterns to Avoid, Common Rationalizations, Detailed Instructions, How It Works, Idea Refine, Output, Overview, Phase 1: Understand & Expand (Divergent) (+9 more)

### Community 68 - "ReOrder: Keep Your Regulars Ordering Direct"
Cohesion: 0.11
Nodes (17): Example 1: Vague Early-Stage Concept (Full 3-Phase Session), Example 2: Feature Idea Within an Existing Product (Codebase-Aware), Example 3: Process/Workflow Idea (Non-Product), Ideation Session Examples, Key Assumptions to Validate, MVP Scope, Not Doing (and Why), Open Questions (+9 more)

### Community 69 - "Idea Refine"
Cohesion: 0.11
Nodes (17): Anti-patterns to Avoid, Common Rationalizations, Detailed Instructions, How It Works, Idea Refine, Output, Overview, Phase 1: Understand & Expand (Divergent) (+9 more)

### Community 70 - "authorize.js"
Cohesion: 0.11
Nodes (7): authzService, requireOwnership(), childService, classService, coreRouter, AuditService, Mitigated Risks (Working as Intended)

### Community 72 - "AppError.js"
Cohesion: 0.22
Nodes (6): AppError, BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError

### Community 73 - "Doubt-Driven Development"
Cohesion: 0.12
Nodes (15): Common Rationalizations, Cross-model escalation, Doubt-Driven Development, Interaction with Other Skills, Loading Constraints, Overview, Red Flags, Step 1: CLAIM — Surface what stands (+7 more)

### Community 74 - "Strix Cloud (managed, no local infra)"
Cohesion: 0.12
Nodes (15): 0. Credits & top-ups, 1. Register the target as an asset, 2. Launch a scan, 3. Wait for completion, 4. Read findings, 5. Export & report, 6. PR reviews, 7. Continuous testing (schedules & webhooks) (+7 more)

### Community 75 - "Process"
Cohesion: 0.12
Nodes (15): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+7 more)

### Community 76 - "Doubt-Driven Development"
Cohesion: 0.12
Nodes (15): Common Rationalizations, Cross-model escalation, Doubt-Driven Development, Interaction with Other Skills, Loading Constraints, Overview, Red Flags, Step 1: CLAIM — Surface what stands (+7 more)

### Community 77 - "Strix Cloud (managed, no local infra)"
Cohesion: 0.12
Nodes (15): 0. Credits & top-ups, 1. Register the target as an asset, 2. Launch a scan, 3. Wait for completion, 4. Read findings, 5. Export & report, 6. PR reviews, 7. Continuous testing (schedules & webhooks) (+7 more)

### Community 78 - "Process"
Cohesion: 0.12
Nodes (15): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+7 more)

### Community 81 - "admin/CamerasPage.jsx"
Cohesion: 0.23
Nodes (9): cameraApi, WebRTCPlayer(), CameraPermissionsPage(), FALLBACK_CAMERAS, FALLBACK_USERS, CamerasPage(), INITIAL_CAMERAS, DEFAULT_CAMERAS (+1 more)

### Community 82 - "Using Agent Skills"
Cohesion: 0.13
Nodes (14): 1. Surface Assumptions, 2. Manage Confusion Actively, 3. Push Back When Warranted, 4. Enforce Simplicity, 5. Maintain Scope Discipline, 6. Verify, Don't Assume, Core Operating Behaviors, Failure Modes to Avoid (+6 more)

### Community 83 - "Using Agent Skills"
Cohesion: 0.13
Nodes (14): 1. Surface Assumptions, 2. Manage Confusion Actively, 3. Push Back When Warranted, 4. Enforce Simplicity, 5. Maintain Scope Discipline, 6. Verify, Don't Assume, Core Operating Behaviors, Failure Modes to Avoid (+6 more)

### Community 84 - "app.js"
Cohesion: 0.17
Nodes (6): allowedOrigins, app, ALLOWED_SECTIONS, storage, upload, uploadImage()

### Community 85 - "@prisma/client"
Cohesion: 0.14
Nodes (6): @prisma/client@^5.20.0, app, app, app, app, @prisma/client

### Community 86 - "go2rtc"
Cohesion: 0.13
Nodes (14): container_name, environment, image, logging, network_mode, restart, volumes, driver (+6 more)

### Community 87 - "KidsWorld - Complete Project Architecture & Context Document"
Cohesion: 0.13
Nodes (14): 1. Project Overview & Business Domain, 2. Technology Stack & Architectural Patterns, 3. Camera Streaming Subsystem (`go2rtc`), 4. Design & Branding Constraints, 5. Repository Directory Map, 6. Current State & Verification Checklist, 7 Nursery Cameras Mapping, Access & Security Flow (+6 more)

### Community 88 - "Spec-Driven Development"
Cohesion: 0.14
Nodes (13): Common Rationalizations, Keeping the Spec Alive, Overview, Phase 0: Scope Check, Phase 1: Specify, Phase 2: Plan, Phase 3: Tasks, Phase 4: Implement (+5 more)

### Community 89 - "Spec-Driven Development"
Cohesion: 0.14
Nodes (13): Common Rationalizations, Keeping the Spec Alive, Overview, Phase 0: Scope Check, Phase 1: Specify, Phase 2: Plan, Phase 3: Tasks, Phase 4: Implement (+5 more)

### Community 90 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 91 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 92 - "seed_data.cjs"
Cohesion: 0.20
Nodes (6): prisma, bcrypt@^6.0.0, bcrypt, prisma, { PrismaClient }, bcrypt

### Community 93 - "Final Engineering Review"
Cohesion: 0.29
Nodes (6): 1. Release Classification, 2. Unfinished Requirements (vs `docs/SPEC.md`), 3. Architecture & Codebase Status, 6. Performance & Scalability Risks, 7. Recommended Next Steps, Final Engineering Review

### Community 94 - "helpers.js"
Cohesion: 0.37
Nodes (7): @playwright/test, loginAsAdmin(), mockBackendApis(), setupAdminAuth, setupGuestAuth, setupGuestSession(), setupNetworkAndConsoleMonitor()

### Community 95 - "Documentation Lookup"
Cohesion: 0.17
Nodes (11): Authentication, Common Mistakes, Documentation Lookup, Error Handling, Result fields, Selection process, Step 1: Resolve a Library, Step 2: Query Documentation (+3 more)

### Community 96 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 97 - "Documentation Lookup"
Cohesion: 0.17
Nodes (11): Authentication, Common Mistakes, Documentation Lookup, Error Handling, Result fields, Selection process, Step 1: Resolve a Library, Step 2: Query Documentation (+3 more)

### Community 98 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 100 - "@vitejs/plugin-react"
Cohesion: 0.33
Nodes (4): vite, @vitejs/plugin-react, vite@^8.2.2, @vitejs/plugin-react@^6.1.0

### Community 101 - "main.jsx"
Cohesion: 0.18
Nodes (4): react-dom, react-dom@^19.2.8, ErrorBoundary, queryClient

### Community 102 - ".agents/skills/penetration-testing-with-strix/SKILL.md"
Cohesion: 0.18
Nodes (10): Exit codes (headless), Option A — Open-source CLI (self-hosted), Option B — Managed cloud (no local infra), Prerequisites, Reading results, Reporting & next steps, Run a Strix pentest, Running a scan (+2 more)

### Community 103 - "mcp.json"
Cohesion: 0.20
Nodes (10): context7, graphify, magic-mcp, magic-remote, API_KEY, CONTEXT7_API_KEY, npx, uvx (+2 more)

### Community 104 - ".antigravity/skills/penetration-testing-with-strix/SKILL.md"
Cohesion: 0.18
Nodes (10): Exit codes (headless), Option A — Open-source CLI (self-hosted), Option B — Managed cloud (no local infra), Prerequisites, Reading results, Reporting & next steps, Run a Strix pentest, Running a scan (+2 more)

### Community 105 - "env.js"
Cohesion: 0.15
Nodes (3): _env, envSchema, EmailService

### Community 106 - "cms/cms.controller.js"
Cohesion: 0.11
Nodes (3): storage, cmsService, cmsRouter

### Community 110 - "KidsWorld Production Deployment Guide"
Cohesion: 0.18
Nodes (10): 1. System Architecture, 2. Environment Configuration, 3. Database Migration Process, 4. Docker Deployment, 5. Reverse Proxy & HTTPS Configuration Guidance, 6. Backup Strategy, 7. Logging & Monitoring Readiness, 8. Mobile Release Configuration (React Native / Expo) (+2 more)

### Community 111 - "Nursery Management Platform Specification"
Cohesion: 0.18
Nodes (10): 1. Overview, 2. Technology Stack, 3. Core Features, 4.1. Core Management, 4.2. Daily Operations & Communication, 4.3. Parent Services, 4.4. Platform Services, 4. Modules (+2 more)

### Community 112 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, preview, test, test:e2e, test:e2e:headed (+3 more)

### Community 114 - "CameraController"
Cohesion: 0.14
Nodes (3): sessionRepo, CameraController, accessLimiter

### Community 116 - "OperationsRepository"
Cohesion: 0.20
Nodes (4): OperationsRepository, 2. Backend API & Repositories, Optimization: Missing Pagination for High-Volume Endpoints, Optimization: N+1 Query Traps in Serializations

### Community 117 - "API Specification"
Cohesion: 0.20
Nodes (9): API Specification, Auth, Authentication, Cameras, Children, Communication, Design Principles, Error Handling (+1 more)

### Community 118 - "Performance Audit Report"
Cohesion: 0.20
Nodes (9): 1. Database & Prisma Module, 3. React Web Application (`web/`), 4. React Native Mobile Application (`apps/mobile/`), 5. Summary Recommendation, Optimization: Heavy Startup / Over-Fetching, Optimization: Missing Foreign Key Indexes, Optimization: Missing Image & Video Optimization Strategies, Optimization: Monolithic Bundle Size (+1 more)

### Community 119 - "Detailed Findings"
Cohesion: 0.20
Nodes (9): 1. SEC-001: Broken Session Management (Missing Cookie Parser), 2. SEC-002: Insufficient Rate Limiting on Authentication (Brute Force), 3. SEC-003: Weak Password Complexity Enforcement, 4. SEC-004: Lack of CSRF Protection for Cookie Sessions, 5. SEC-005: File Upload & Path Traversal Risks (Not Implemented Yet), 6. SEC-006: Server-Side Request Forgery (SSRF) in Camera Proxying, Detailed Findings, Executive Summary (+1 more)

### Community 120 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 121 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 122 - "auth.controller.js"
Cohesion: 0.15
Nodes (3): authService, passwordComplexity, authRouter

### Community 123 - "reporting.controller.js"
Cohesion: 0.15
Nodes (3): reportingService, Rating, reportingRouter

### Community 128 - "Architecture Review"
Cohesion: 0.22
Nodes (8): 1. IDOR Risks & Authorization Bottlenecks, 2. Parent-Branch Multi-Tenancy Flaw, 3. Media Server Scalability & Load Testing, 4. JWT Token Revocation & Session Management, 5. Privacy and Consent Gaps (Camera Module), 6. Hardcoded Camera Credentials, 7. Web vs. Mobile Consistency (Deep Linking), Architecture Review

### Community 129 - "دليل إعداد وتشغيل بيئة البث المباشر للكاميرات (WebRTC & go2rtc)"
Cohesion: 0.22
Nodes (8): 1. مواصفات وخطة سيرفر الـ VPS (Hetzner / DigitalOcean), 2. إعداد النطاق في Cloudflare DNS (شرط حاسم), 3. تثبيت وتشغيل go2rtc على الـ VPS, 4. إعداد خدمة الـ Systemd للعمل التلقائي, 5. إعداد Nginx وشهادة SSL المجانية (Certbot), 6. التحقق من عمل البث (Testing), دليل إعداد وتشغيل بيئة البث المباشر للكاميرات (WebRTC & go2rtc), ملف الإعدادات `go2rtc.yaml` لكاميرات الحضانة الـ 7:

### Community 130 - "How to Fetch Documentation"
Cohesion: 0.25
Nodes (7): Guidelines, How to Fetch Documentation, Step 1: Resolve the Library ID, Step 2: Select the Best Match, Step 3: Fetch the Documentation, Step 4: Use the Documentation, When to Use This Skill

### Community 131 - "How to Fetch Documentation"
Cohesion: 0.25
Nodes (7): Guidelines, How to Fetch Documentation, Step 1: Resolve the Library ID, Step 2: Select the Best Match, Step 3: Fetch the Documentation, Step 4: Use the Documentation, When to Use This Skill

### Community 138 - "Architecture Decisions Record (ADR)"
Cohesion: 0.25
Nodes (7): 1. Backend Framework: Node.js + Express, 2. Database & ORM: MySQL + Prisma, 3. Mobile Framework: React Native, 4. Camera Streaming: HLS vs. WebRTC, 5. Styling and UI, 6. Architecture Pattern: Clean Architecture, Architecture Decisions Record (ADR)

### Community 139 - "Security Vulnerability Fix Plan"
Cohesion: 0.25
Nodes (7): 1. Fix Broken Session Management (SEC-001), 2. Implement Authentication Rate Limiting (SEC-002), 3. Enforce Strict Password Complexity (SEC-003), 4. Strengthen Web CSRF Protections (SEC-004), 5. Security Guardrails for Future Document Implementation (SEC-005), 6. Execution Order, Security Vulnerability Fix Plan

### Community 140 - "21st.dev UI Skill"
Cohesion: 0.29
Nodes (6): 21st.dev UI Skill, Logos, Setup and auth, When to reach for it, Workflow: generate new UI, Workflow: install an existing component (default path)

### Community 141 - ".agents/skills/ci-security-scanning-with-strix/SKILL.md"
Cohesion: 0.29
Nodes (6): GitHub Actions, Option A — Self-hosted OSS CLI in the runner, Option B — Managed platform (no runner infra), Optional: upload findings to GitHub code scanning, Other CI systems, Set up Strix in CI/CD

### Community 142 - "Find security vulnerabilities in code"
Cohesion: 0.29
Nodes (6): Complementary tooling, Find security vulnerabilities in code, Fix and verify, Read the results, Reviewing a pull request instead of the whole repo, Run it

### Community 143 - "21st.dev UI Skill"
Cohesion: 0.29
Nodes (6): 21st.dev UI Skill, Logos, Setup and auth, When to reach for it, Workflow: generate new UI, Workflow: install an existing component (default path)

### Community 144 - ".antigravity/skills/ci-security-scanning-with-strix/SKILL.md"
Cohesion: 0.29
Nodes (6): GitHub Actions, Option A — Self-hosted OSS CLI in the runner, Option B — Managed platform (no runner infra), Optional: upload findings to GitHub code scanning, Other CI systems, Set up Strix in CI/CD

### Community 145 - "Find security vulnerabilities in code"
Cohesion: 0.29
Nodes (6): Complementary tooling, Find security vulnerabilities in code, Fix and verify, Read the results, Reviewing a pull request instead of the whole repo, Run it

### Community 146 - "AuthService.js"
Cohesion: 0.12
Nodes (3): SessionRepository, UserRepository, 4. Technical Debt & Inconsistencies

### Community 148 - "Deployment Strategy"
Cohesion: 0.29
Nodes (6): 1. Environments, 2. Infrastructure (Containerization), 3. Cloud Provider, 4. Backups and Recovery, 5. Monitoring & Logging, Deployment Strategy

### Community 149 - "Implementation Plan"
Cohesion: 0.29
Nodes (6): Implementation Plan, Phase 1: Foundation & Architecture Setup, Phase 2: Core Nursery Operations, Phase 3: Communication & Media, Phase 4: Advanced Features & Cameras, Phase 5: Testing, Polish, & Launch

### Community 150 - "Mobile Architecture (React Native)"
Cohesion: 0.29
Nodes (6): 1. Core Stack, 2. i18n & RTL Support, 3. Deep Linking, 4. Video Playback, 5. Offline Capabilities & Caching, Mobile Architecture (React Native)

### Community 151 - "Notifications System"
Cohesion: 0.29
Nodes (6): 1. Push Notifications, 2. Notification Triggers, 3. Localization, 4. Preferences, Device Registration Flow, Notifications System

### Community 152 - "Security-test an API"
Cohesion: 0.33
Nodes (5): 1. Gather what the agents need, 2. Run the scan, 3. Verify findings, 4. Fix, re-test, and keep it tested, Security-test an API

### Community 153 - "Application security testing"
Cohesion: 0.33
Nodes (5): 1. Map the assets, 2. Pick the right test per asset, 3. Consolidate into one plan, 4. Be honest about coverage, Application security testing

### Community 154 - "Fix Strix findings and verify"
Cohesion: 0.33
Nodes (5): 1. Triage, 2. Fix, 3. Verify by re-running Strix, 4. Report, Fix Strix findings and verify

### Community 155 - "Test against the OWASP Top 10"
Cohesion: 0.33
Nodes (5): Report honestly, Run it, Test against the OWASP Top 10, Then fix and re-test, What is and is not testable by an agent

### Community 156 - "Pentest a web application"
Cohesion: 0.33
Nodes (5): 1. Confirm authorization and scope, 2. Run the scan, 3. Review results, 4. Fix and verify, Pentest a web application

### Community 157 - "Security-test an API"
Cohesion: 0.33
Nodes (5): 1. Gather what the agents need, 2. Run the scan, 3. Verify findings, 4. Fix, re-test, and keep it tested, Security-test an API

### Community 158 - "Application security testing"
Cohesion: 0.33
Nodes (5): 1. Map the assets, 2. Pick the right test per asset, 3. Consolidate into one plan, 4. Be honest about coverage, Application security testing

### Community 159 - "Fix Strix findings and verify"
Cohesion: 0.33
Nodes (5): 1. Triage, 2. Fix, 3. Verify by re-running Strix, 4. Report, Fix Strix findings and verify

### Community 160 - "Test against the OWASP Top 10"
Cohesion: 0.33
Nodes (5): Report honestly, Run it, Test against the OWASP Top 10, Then fix and re-test, What is and is not testable by an agent

### Community 161 - "Pentest a web application"
Cohesion: 0.33
Nodes (5): 1. Confirm authorization and scope, 2. Run the scan, 3. Review results, 4. Fix and verify, Pentest a web application

### Community 164 - "ClassService"
Cohesion: 0.14
Nodes (3): ClassRepository, FALLBACK_CLASSES, ClassService

### Community 165 - "Camera & Media Architecture"
Cohesion: 0.33
Nodes (5): 1. Media Server, 2. Security & Access, 3. Bandwidth, Architecture, Camera & Media Architecture

### Community 166 - "Security & Authorization"
Cohesion: 0.33
Nodes (5): 1. Authentication, 2. Role-Based Access Control (RBAC) & Ownership, 3. Camera Privacy & Access, 4. Audit Logging, Security & Authorization

### Community 167 - "Testing Strategy"
Cohesion: 0.33
Nodes (5): 1. Backend Testing, 2. Frontend Web Testing, 3. Mobile Testing, 4. Continuous Integration (CI), Testing Strategy

### Community 169 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 171 - "routes.js"
Cohesion: 0.25
Nodes (3): autoRouter, v1Router, express

### Community 174 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, test

### Community 176 - "i18n.js"
Cohesion: 0.40
Nodes (3): i18next-browser-languagedetector, i18next-browser-languagedetector@^8.2.1, resources

### Community 179 - "System Architecture"
Cohesion: 0.50
Nodes (3): Backend Clean Architecture, High-Level Architecture, System Architecture

### Community 180 - "Database Architecture"
Cohesion: 0.50
Nodes (3): Database Architecture, Entity Relationship Diagram, Key Considerations

### Community 181 - "MainTabs.jsx"
Cohesion: 0.09
Nodes (22): lucide-react-native@^1.34.0, Stack, Tab, ClassesScreen(), styles, styles, TasksScreen(), TEACHERS_LIST (+14 more)

### Community 182 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **5 isolated node(s):** `@upstash/context7-mcp`, `CONTEXT7_API_KEY`, `@21st-dev/magic`, `API_KEY`, `uvx`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2019 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `seed_cameras.cjs`, `prisma.js`, `backend/package.json`, `seed_data.cjs`, `AuthzService`, `users.controller.js`, `authorization.test.js`, `cms.test.js`, `notifications.test.js`, `prisma.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `@upstash/context7-mcp`, `CONTEXT7_API_KEY`, `@21st-dev/magic` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `express` connect `routes.js` to `communication.controller.js`, `notifications.controller.js`, `authorize.js`, `operations.controller.js`, `cms/cms.controller.js`, `backend/package.json`, `users.controller.js`, `CameraController`, `app.js`, `auth.controller.js`, `reporting.controller.js`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `src/App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05834464043419267 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `mobile/package.json`, `MainTabs.jsx`, `MainTabs.jsx`, `services/api.js`, `ScreenWrapper.jsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.03990610328638498 - nodes in this community are weakly interconnected._