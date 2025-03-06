FROM node:18-alpine AS base

# ARG NEXT_PUBLIC_URL="https://app.dev.connqt.ai"
# ARG NEXT_PUBLIC_API_BASE_URL="https://api.dev.connqt.ai"
# ARG NEXT_PUBLIC_BWAN_PARTNER_ID="0hInfMPA"
# ARG NEXT_PUBLIC_BWAN_APP_ID="2363291520686385"
# ARG NEXT_PUBLIC_BWAN_CONFIG_ID="28664044026527454"
# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* /app
# COPY pkg/cqt-shared-1.0.0.tgz /app/pkg/
RUN npm install --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . /app

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i sharp && npm run build:icons && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the correct permission for prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000


CMD ["node", "server.js"]
