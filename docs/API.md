# API Specification

The backend exposes a RESTful API.

## Design Principles
- **Versioning:** All endpoints are prefixed with `/api/v1/`.
- **Content Type:** JSON for data, `multipart/form-data` for file uploads.
- **Pagination:** Cursor-based or limit/offset for list endpoints.
- **Standard Responses:**
  - Success: `{ "data": { ... }, "meta": { ... } }`
  - Error: `{ "error": { "code": "...", "message": "..." } }`

## Authentication
APIs are protected using JWT Bearer tokens passed in the `Authorization` header.

## Sample Endpoints

### Auth
- `POST /api/v1/auth/login`: Authenticate and return JWT.
- `POST /api/v1/auth/refresh`: Refresh token.
- `POST /api/v1/auth/forgot-password`: Trigger reset email.

### Children
- `GET /api/v1/children`: List children (scoped by role: Admin sees all, Teacher sees their class, Parent sees their own).
- `GET /api/v1/children/:id`: Get details.
- `POST /api/v1/children/:id/attendance`: Log attendance.

### Communication
- `GET /api/v1/messages`: Fetch conversation threads.
- `POST /api/v1/messages`: Send a message.
- `GET /api/v1/posts`: Fetch CMS posts.

### Cameras
- `GET /api/v1/cameras/access`: Request temporary streaming credentials/tokens for accessible cameras.

## Error Handling
Errors are caught in a central middleware and formatted consistently. Internal stack traces are hidden in production.
