# KidsWorld Production Deployment Guide

> [!WARNING]
> **Status:** Unverified. 
> This documentation outlines the architecture and steps required to deploy the KidsWorld platform to a production environment. However, due to critical blockers (missing Prisma code generation and missing application source code), this deployment has **not** been executed or verified live. 

## 1. System Architecture

The KidsWorld platform requires the following infrastructure:
- **Relational Database**: MySQL 8.x
- **In-Memory Cache**: Redis 7.x
- **Backend API**: Node.js 22.x (Dockerized)
- **Frontend SPA**: React/Vite served via Nginx (Dockerized)
- **Media Server (Cameras)**: A WebRTC/HLS capable media server (e.g., LiveKit, Mediasoup, or a managed service).
- **Reverse Proxy**: Nginx or Traefik for SSL termination and routing.

## 2. Environment Configuration
1. Clone the repository on your production host.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with strong cryptographic secrets (e.g., `JWT_SECRET`) and proper database credentials.

## 3. Database Migration Process
Because Prisma is used as the ORM, schema migrations must be applied carefully to ensure zero downtime.
1. During deployment, run the Prisma migration deploy command against the production database:
   ```bash
   npx prisma migrate deploy
   ```
   *Note: Never use `prisma db push` in production as it can drop tables.*

## 4. Docker Deployment
A `docker-compose.yml` is provided at the root of the project to orchestrate the backend, web, database, and redis instances.

To start the cluster:
```bash
docker-compose up -d --build
```

## 5. Reverse Proxy & HTTPS Configuration Guidance
It is critical that both the API and Web App are served over HTTPS.
**Example Nginx Reverse Proxy Configuration (Host Level)**:
```nginx
server {
    listen 80;
    server_name app.kidsworld.example.com api.kidsworld.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.kidsworld.example.com;

    ssl_certificate /etc/letsencrypt/live/app.kidsworld.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.kidsworld.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080; # Points to Docker web container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name api.kidsworld.example.com;

    ssl_certificate /etc/letsencrypt/live/api.kidsworld.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kidsworld.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000; # Points to Docker backend container
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
*Use `certbot --nginx` to automatically provision Let's Encrypt certificates.*

## 6. Backup Strategy
- **MySQL Data**: Run automated daily logical backups (`mysqldump`) via a cron job on the host machine. Store backups encrypted in an off-site object storage bucket (e.g., AWS S3).
- **Files/Documents**: If local storage is used for uploads (via Multer), the `/uploads` directory must be backed up daily to S3. (It is highly recommended to refactor to direct-to-S3 uploads for stateless scaling).

## 7. Logging & Monitoring Readiness
- The Node.js application utilizes `pino` for structured JSON logging.
- **Monitoring**: Forward Docker logs to an aggregator like Datadog or ELK stack using the Docker logging driver.
- **Health Checks**: The backend exposes `/api/v1/health`. Configure your load balancer or orchestrator (Docker Swarm/K8s) to poll this endpoint to restart unhealthy instances.

## 8. Mobile Release Configuration (React Native / Expo)
The mobile apps are located in `apps/mobile/`.
1. **App Stores**: Register iOS App Identifier and Android Package Name.
2. **EAS (Expo Application Services)**:
   - Configure `eas.json` for production profiles.
   - Run `eas build --platform ios --profile production`
   - Run `eas build --platform android --profile production`
3. **Over-The-Air (OTA)**: Use EAS Update for minor JavaScript bug fixes without going through app store review.

## 9. Media Server (Camera) Considerations
The IP Cameras must *never* be exposed directly to the public internet.
1. The Media Server must ingest internal RTSP streams and convert them to HLS/WebRTC.
2. The Backend API acts as the gatekeeper. When a parent requests access, the API issues a short-lived token to the client.
3. The client connects to the Media Server using the token. The Media Server verifies the token with the Backend API before piping the stream.
