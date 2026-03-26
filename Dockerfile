# ---------- 1️⃣ Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

RUN npx prisma generate

# Build Next.js app
RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="mysql://root:root@mysql:3306/myapp_db"

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Install only production dependencies


EXPOSE 3000

CMD ["npm", "run", "start"]