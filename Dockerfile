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
