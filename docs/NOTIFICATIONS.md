# Notifications System

## 1. Push Notifications
We use Firebase Cloud Messaging (FCM) as the intermediary for both Android and iOS (via APNs).

### Device Registration Flow
1. Mobile app requests permission from the OS.
2. App receives FCM token.
3. App sends token to backend `POST /api/v1/users/devices`.
4. Backend stores token mapped to the user ID.

## 2. Notification Triggers
Notifications are dispatched via asynchronous workers/queues (e.g., BullMQ) to avoid blocking HTTP requests.

**Use Cases:**
- **Attendance:** "Your child has been checked in."
- **Messaging:** New message from a teacher.
- **Events/Posts:** New announcements.
- **System:** Camera schedule starting soon.

## 3. Localization
Notification payloads include localization keys rather than hardcoded strings where possible, or the backend translates the message into the user's preferred language before sending.

## 4. Preferences
Users have a preferences table/object in the database allowing them to toggle notification types (e.g., mute event reminders but keep attendance alerts).
