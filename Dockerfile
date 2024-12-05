FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS build
COPY protos src .env bun.lockb index.html package.json tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
ENV PATH=$PATH:/usr/src/app/node_modules/.bin
RUN chmod +x node_modules/.bin/
RUN bun install
RUN bun vite build

# FROM base AS install
# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb protos /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile

# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb protos /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# FROM base AS build
# COPY --from=install /temp/dev/node_modules node_modules
# COPY --from=install /temp/dev/package.json .
# COPY src .env index.html tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts .
# ENV PATH=$PATH:/usr/src/app/node_modules/.bin
# RUN chmod +x node_modules/.bin/
# RUN bun install vite
# RUN bun vite build

FROM base AS release_legacy
COPY --from=build dist dist

ENV NODE_ENV=production
USER bun
EXPOSE 5173/tcp
ENTRYPOINT [ "bun", "vite", "./dist" ]
