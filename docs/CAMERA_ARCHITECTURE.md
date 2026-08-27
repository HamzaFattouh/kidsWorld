# Camera & Media Architecture

Camera integration is a critical feature requiring high security and privacy.

## Architecture

```mermaid
sequenceDiagram
    participant Camera (RTSP)
    participant MediaServer
    participant Backend API
    participant Client App

    Camera->>MediaServer: Continuous RTSP Stream
    Client App->>Backend API: GET /api/v1/cameras/access (Class ID)
    Backend API-->>Backend API: Validate Parent, Child Class, and Schedule
    Backend API->>Client App: Return temporary signed token/URL
    Client App->>MediaServer: Request HLS/WebRTC with Token
    MediaServer-->>MediaServer: Validate Token
    MediaServer->>Client App: Stream Video
```

## 1. Media Server
We deploy a specialized media server (e.g., MediaMTX, Kurento, or SRS) that ingests RTSP streams from the physical IP cameras in the nursery and transcodes/repackages them to HLS and WebRTC.

## 2. Security & Access
- The media server must authenticate viewer requests.
- The Node.js backend acts as the gatekeeper. When a parent wants to view a camera, they request a ticket/token from the API.
- The API checks business rules: Is it the right time? Is the child checked in?
- The backend signs a short-lived JWT that the client passes to the media server.

## 3. Bandwidth
- HLS will be the primary delivery method as it scales cheaply across CDNs if required.
- Stream quality is locked at 720p or lower to reduce bandwidth on both the nursery's uplink and the server out.
