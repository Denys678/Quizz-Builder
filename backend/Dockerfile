FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Generate Prisma Client and compile TypeScript
RUN DATABASE_URL="postgresql://unused:unused@localhost:5432/unused" \
    npx prisma generate && npm run build

ENV NODE_ENV=production

EXPOSE 5001

# Apply migrations and start Express
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
