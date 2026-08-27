# Architecture Decisions Record (ADR)

## 1. Backend Framework: Node.js + Express
**Decision:** We will use Node.js with Express rather than alternatives like NestJS or Koa.
**Rationale:** Express is lightweight, highly flexible, and has a massive ecosystem. While NestJS provides strict structure, Express allows us to build a tailored Clean Architecture without framework lock-in.

## 2. Database & ORM: MySQL + Prisma
**Decision:** MySQL as the relational database, interfaced via Prisma ORM.
**Rationale:** MySQL provides a robust relational structure suitable for complex RBAC and child-parent linkages. Prisma offers excellent type safety, intuitive schema migrations, and a great developer experience compared to older ORMs like Sequelize or TypeORM.

## 3. Mobile Framework: React Native
**Decision:** React Native for iOS and Android.
**Rationale:** Maximizes code sharing and developer skill crossover with the React.js web app. Deep linking and Push Notifications (FCM/APNs) are well-supported.

## 4. Camera Streaming: HLS vs. WebRTC
**Decision:** We will use a hybrid approach. HLS for standard viewing, WebRTC for potential low-latency features.
**Rationale:** HLS is highly scalable, cacheable via CDNs, and firewall-friendly, making it ideal for hundreds of parents viewing simultaneously. WebRTC provides sub-second latency but is more complex to scale and manage.

## 5. Styling and UI
**Decision:** Vanilla CSS / CSS Modules / Styled Components for React, with careful abstraction for RTL/LTR.
**Rationale:** Supports complex custom themes (Light/Dark) and dynamic RTL switching for Arabic without relying entirely on a heavy UI framework.

## 6. Architecture Pattern: Clean Architecture
**Decision:** The backend will follow Clean Architecture principles (Entities, Use Cases, Interfaces/Adapters, Frameworks).
**Rationale:** Isolates business rules (nursery logic, permissions) from technical details (Express routing, Prisma database queries), making the system highly testable and maintainable.
