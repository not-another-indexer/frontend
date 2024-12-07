FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS final
COPY src src
RUN mkdir -p src/protos
COPY protos/gen ./src/protos
COPY .env .
COPY bun.lockb .
COPY index.html .
COPY package.json .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
ENV PATH=$PATH:/usr/src/app/node_modules/.bin
RUN bun install
RUN bun install vite
RUN chmod +x node_modules/.bin/
RUN bun vite build

ENV NODE_ENV=production
USER bun
EXPOSE 5173/tcp
ENTRYPOINT [ "bun", "vite", "./dist", "--host" ]


# Используем официальный образ Bun
FROM oven/bun:latest AS base

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем исходный код в контейнер
COPY src src
COPY .env .
COPY bun.lockb .
COPY index.html .
COPY package.json .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

# Устанавливаем зависимости
RUN bun install

# Копируем сгенерированные файлы
COPY protos/gen ./src/protos

# Исправляем права доступа для директорий
RUN chmod -R 777 /usr/src/app/node_modules /usr/src/app/src /usr/src/app

# Строим проект
RUN bun vite build

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Устанавливаем пользователя bun (убедитесь, что этот пользователь существует и имеет права)
USER bun

# Открываем порт для приложения
EXPOSE 5173/tcp

# Запускаем приложение
ENTRYPOINT [ "bun", "vite", "./dist", "--host" ]
