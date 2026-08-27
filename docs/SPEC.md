# Nursery Management Platform Specification

## 1. Overview
The Nursery Management Platform is a comprehensive solution designed to connect admins, teachers, and parents. It handles the daily operations of a nursery, from child management and attendance to secure camera monitoring and messaging.

## 2. Technology Stack
- **Frontend Web:** React.js
- **Mobile Apps:** React Native (iOS & Android)
- **Backend API:** Node.js + Express
- **Database:** MySQL + Prisma ORM
- **Camera Streaming:** Secure HLS/WebRTC

## 3. Core Features
- **Internationalization:** Arabic (RTL) and English (LTR) support out of the box.
- **Theming:** Light, Dark, and System modes across all platforms.
- **Role-Based Access Control (RBAC):** Admin, Teacher, and Parent roles.

## 4. Modules
### 4.1. Core Management
- **Child Management:** Profiles, medical records, emergency contacts.
- **Attendance & Pickup:** Tracking daily check-ins, check-outs, and authorized pickup rules.
- **Forms & Consent:** Digital signatures and privacy consent forms.
- **Documents:** Secure storage for child and staff records.

### 4.2. Daily Operations & Communication
- **Meals & Weekly Notes:** Tracking feeding schedules and teacher notes.
- **Evaluations:** Periodic developmental assessments.
- **Messaging:** Direct communication between parents and teachers.
- **Posts & CMS:** Announcements, newsletters, and general posts.
- **Events:** Calendar for nursery events with RSVPs.
- **Gallery:** Secure photo sharing with parents.

### 4.3. Parent Services
- **Complaints & Requests:** Ticketing system for parent inquiries and issues.

### 4.4. Platform Services
- **Camera Monitoring:** Scheduled, permission-based access to live camera feeds.
- **Notifications:** FCM/APNs push notifications, SMS, and email.
- **Deep Linking:** Routing directly to specific app modules from external links.
- **Reports:** Operational, financial, and attendance reporting.
- **Audit Logs:** Tracking critical administrative and data access actions.

## 5. Non-Functional Requirements
- **Future Multi-branch Support:** The architecture must allow extending to multi-tenant or multi-branch architectures.
- **Scalability:** Must support concurrent parent connections, especially during camera viewing windows.
- **Security & Privacy:** High emphasis on media privacy, consent, and strict access controls based on schedules and roles.
