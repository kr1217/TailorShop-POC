# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: Production image ───────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

# Install mysql-client and wget for healthcheck
RUN apt-get update && apt-get install -y default-mysql-client wget && rm -rf /var/lib/apt/lists/*

# Run as non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

CMD ["node", "src/server.js"]
