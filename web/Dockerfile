# Web Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
# In a monorepo, you would copy the lockfile or workspace definitions.
RUN npm install

COPY . .
RUN npm run build

# Production static server
FROM nginx:alpine AS runner

# Copy compiled assets from builder to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default config for SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
