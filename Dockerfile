# 1. Base Build Image
FROM node:18-alpine AS build

# Install required build tools
RUN apk add --no-cache g++ make py3-pip libc6-compat

# Set working directory
WORKDIR /app

# Copy only the package files
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy the rest of the application
COPY . .

# Optional: Build icons or other pre-build steps
RUN npm run build:icons

# Build the app (adjust based on your framework)
RUN npm run build

# 2. Production Image (minimal runtime)
FROM node:18-alpine AS prod

# Set NODE_ENV
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy only what's needed from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist  # Adjust if your output folder is named differently
COPY --from=build /app/node_modules ./node_modules

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
