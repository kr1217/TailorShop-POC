# ══════════════════════════════════════════════════════════════════════════════
#  Stage 1 — Frontend: install deps
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-slim AS fe-deps
WORKDIR /fe
COPY frontend/package*.json ./
RUN npm ci

# ══════════════════════════════════════════════════════════════════════════════
#  Stage 2 — Frontend: build Next.js standalone bundle
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-slim AS fe-builder
WORKDIR /fe
COPY --from=fe-deps /fe/node_modules ./node_modules
COPY frontend/ .

ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ══════════════════════════════════════════════════════════════════════════════
#  Stage 3 — Backend: install prod deps only
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-slim AS be-deps
WORKDIR /be
COPY backend/package*.json ./
RUN npm ci --omit=dev

# ══════════════════════════════════════════════════════════════════════════════
#  Stage 4 — Final runtime: both services + supervisord
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-slim AS runner
WORKDIR /app

# Install supervisord + wget + mysql-client
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        supervisor \
        wget \
        default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# ── Copy backend ──────────────────────────────────────────────────────────────
COPY --from=be-deps /be/node_modules ./backend/node_modules
COPY backend/ ./backend/

# ── Copy frontend standalone output ───────────────────────────────────────────
COPY --from=fe-builder /fe/.next/standalone ./frontend/
COPY --from=fe-builder /fe/.next/static     ./frontend/.next/static
COPY --from=fe-builder /fe/public           ./frontend/public

# ── supervisord config ────────────────────────────────────────────────────────
COPY supervisord.conf /app/supervisord.conf

# Non-root user
RUN groupadd -r appgroup && \
    useradd  -r -g appgroup appuser && \
    chown -R appuser:appgroup /app

USER appuser

# Expose both ports
EXPOSE 3000 5000

# Start supervisord directly with the config
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
