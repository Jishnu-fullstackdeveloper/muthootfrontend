# ---- Stage 1: Build the app ----
    FROM node:18-alpine AS builder

    # Install dependencies required for building native modules
    RUN apk add --no-cache g++ make py3-pip libc6-compat
    
    # Set working directory
    WORKDIR /app
    
    # Copy all project files
    COPY . .
    
    # Install dependencies & run postinstall (build:icons will be triggered)
    RUN npm ci
    
    # Build the Next.js app for production
    RUN npm run build --production
    
    # ---- Stage 2: Create production image ----
    FROM node:18-alpine AS runner
    
    # Create app directory
    WORKDIR /app
    
    # Install production-only dependencies
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package*.json ./
    
    # Copy built app and public assets
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/src ./src
    
    # Copy any other files needed at runtime (like next.config.js)
    COPY --from=builder /app/next.config.js ./
    
    # Set environment to production
    ENV NODE_ENV=production
    
    # Expose the port Next.js runs on
    EXPOSE 3000
    
    # Start the Next.js SSR server
    CMD ["npm", "start"]
    