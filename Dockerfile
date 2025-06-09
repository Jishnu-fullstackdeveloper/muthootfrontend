# Base image
FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000
COPY . .
RUN npm install --force # Install all dependencies for development
RUN npm install tsx --force
# Development stage
FROM base as dev
ENV NODE_ENV=development
WORKDIR /app
RUN npm run build:icons
RUN npm run build --production
# Copy all project files (avoiding this if using bind mounts)
COPY . .

CMD ["npm", "start"]
