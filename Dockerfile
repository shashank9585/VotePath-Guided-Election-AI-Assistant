# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --silent

# Copy source files
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy only the built output
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

# Serve the app using the PORT environment variable (required by GCP Cloud Run)
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
