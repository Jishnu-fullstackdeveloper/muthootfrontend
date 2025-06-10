# ---------- Base image ----------
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache g++ make py3-pip libc6-compat

COPY package*.json ./
RUN npm install --force

# ---------- Build Stage ----------
FROM base AS build
COPY . .
RUN npm run build

# ---------- Production Runtime ----------
FROM node:18-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Copy from build
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
# Copy .env from build image
COPY --from=build /app/.env ./.env

# Start the app
EXPOSE 3000
CMD ["npm", "start"]
