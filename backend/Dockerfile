# Backend Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
# Note: In a functional environment this would run: npx prisma generate
# RUN npx prisma generate

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]
