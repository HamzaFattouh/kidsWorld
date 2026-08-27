# Database Architecture

We use MySQL with Prisma. The schema is designed to handle multiple roles and future multi-branch scaling.

## Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string password_hash
        enum role "ADMIN, TEACHER, PARENT"
        string branch_id FK
        boolean is_active
    }
    
    BRANCH {
        string id PK
        string name
        string timezone
    }

    CHILD {
        string id PK
        string first_name
        string last_name
        date dob
        string branch_id FK
        string class_id FK
    }

    CLASS {
        string id PK
        string name
        string branch_id FK
        string teacher_id FK
    }

    PARENT_CHILD {
        string user_id FK
        string child_id FK
        string relation_type
    }

    ATTENDANCE {
        string id PK
        string child_id FK
        date date
        datetime check_in
        datetime check_out
        string recorded_by FK
    }
    
    CAMERA {
        string id PK
        string name
        string stream_url
        string class_id FK
        boolean is_active
    }

    BRANCH ||--o{ USER : has
    BRANCH ||--o{ CHILD : has
    BRANCH ||--o{ CLASS : has
    USER ||--o{ CLASS : manages
    USER ||--o{ PARENT_CHILD : "is parent of"
    CHILD ||--o{ PARENT_CHILD : "has parent"
    CLASS ||--o{ CHILD : contains
    CHILD ||--o{ ATTENDANCE : has
    CLASS ||--o{ CAMERA : monitored_by
```

## Key Considerations
- **Indexes:** Frequent queries like `child_id` on attendance, or `user_id` on parent_child relations, will have indexes.
- **Audit Trails:** A separate `AUDIT_LOG` table will store `{ action, actor_id, target_id, timestamp, details }`.
- **Soft Deletes:** Most tables will implement a `deleted_at` timestamp to prevent accidental data loss.
