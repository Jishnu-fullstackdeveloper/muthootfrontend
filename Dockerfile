FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim AS runner
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]
