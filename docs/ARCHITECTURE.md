# System Architecture

The platform follows a layered, client-server architecture with dedicated media processing for cameras.

## High-Level Architecture

```mermaid
graph TD
    subgraph Clients
        Web[React Web App]
        iOS[iOS App - React Native]
        Android[Android App - React Native]
    end

    subgraph API Gateway & Load Balancing
        LB[Nginx / Cloud Load Balancer]
    end

    subgraph Backend Services
        API[Node.js / Express API]
        Media[Media Server - e.g., MediaMTX]
        Cron[Background Jobs / Schedulers]
    end

    subgraph Data Layer
        DB[(MySQL)]
        Cache[(Redis - Optional for Sessions/Limits)]
        Storage[S3 / Blob Storage]
    end

    subgraph External Services
        FCM[Firebase Cloud Messaging]
        APN[Apple Push Notifications]
        Cams[IP Cameras / RTSP]
    end

    Web --> LB
    iOS --> LB
    Android --> LB

    LB --> API
    LB --> Media

    API --> DB
    API --> Cache
    API --> Storage
    API --> FCM
    API --> APN

    Cams -->|RTSP Push| Media
    Media -->|HLS/WebRTC| Clients
```

## Backend Clean Architecture

We separate concerns into layers to keep business logic independent of external services.

```mermaid
graph LR
    subgraph Frameworks & Drivers
        Router[Express Routers]
        Prisma[Prisma Client]
    end

    subgraph Interface Adapters
        Controllers[Controllers]
        Repositories[Repository Impls]
    end

    subgraph Application Business Rules
        UseCases[Use Cases / Services]
    end

    subgraph Enterprise Business Rules
        Entities[Domain Models]
    end

    Router --> Controllers
    Controllers --> UseCases
    UseCases --> Entities
    UseCases --> Repositories
    Repositories --> Prisma
```
