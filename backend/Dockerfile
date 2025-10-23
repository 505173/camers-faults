# -------------------------
# 1. Build stage
# -------------------------
FROM node:18-bullseye AS builder

# Устанавливаем зависимости
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Собираем TypeScript
RUN npm run build

# -------------------------
# 2. Production stage
# -------------------------
FROM node:18-bullseye

# Устанавливаем ping
RUN apt-get update && apt-get install -y iputils-ping && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Копируем package.json и node_modules
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Копируем только собранный код
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/seed.ts ./seed.ts

# Устанавливаем переменные окружения
ENV PORT 3000

# Выполняем seed перед запуском приложения
CMD ["sh", "-c", "npx ts-node seed.ts && node dist/main.js"]
