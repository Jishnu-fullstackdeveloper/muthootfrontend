# 1️⃣ Base image with Node
FROM node:18-alpine AS base
WORKDIR /app
 
# Optional: Speed up native package builds
RUN apk add --no-cache libc6-compat
 
# Install only dependencies first for better caching
COPY package*.json ./
RUN npm ci --omit=dev
 
# 2️⃣ Build Stage
FROM base AS builder
COPY . .
 
# Set environment to production for build optimization
ENV NODE_ENV=production
 
# Next.js build (includes .next, public, etc.)
RUN npm run build
 
# 3️⃣ Final Runtime Image
FROM node:18-alpine AS runner
 
# Install minimal dependencies for runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
 
ENV NODE_ENV=production
ENV PORT=3000
 
# Expose the port the app runs on
EXPOSE 3000
 
# Start Next.js in standalone or server mode
CMD ["npm", "start"]
