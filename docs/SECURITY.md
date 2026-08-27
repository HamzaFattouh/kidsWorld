# Security & Authorization

## 1. Authentication
- **JWT (JSON Web Tokens):** Short-lived access tokens and longer-lived refresh tokens.
- **Device Management:** Tokens are bound to device sessions, allowing admins/users to revoke access remotely.
- **Email Verification:** Required for new accounts and password resets.

## 2. Role-Based Access Control (RBAC) & Ownership
Authorization goes beyond simple roles. We implement resource-level ownership checks:

```typescript
// Conceptual authorization middleware
function authorize(action, resource) {
  return async (req, res, next) => {
    const user = req.user;
    if (user.role === 'ADMIN') return next();
    
    if (user.role === 'TEACHER') {
      // Check if teacher is assigned to the class associated with the resource
    }
    
    if (user.role === 'PARENT') {
      // Check if the resource belongs to the parent's child
    }
  }
}
```

## 3. Camera Privacy & Access
- Parents can only view cameras assigned to their child's current class.
- Access is strictly time-bound (e.g., viewing is only allowed between 10:00 AM and 2:00 PM on weekdays).
- Video streams are signed with expiring tokens to prevent sharing URLs outside the app.

## 4. Audit Logging
Every destructive action (DELETE), critical modification (UPDATE to permissions, records), or sensitive access (viewing cameras) is logged to the `AUDIT_LOG` table with the user ID, IP address, and timestamp.
