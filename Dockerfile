FROM node:20-slim AS base
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/fp-monorepo
RUN mkdir /usr/src/next
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./packages/next/package.json ./packages/next/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install
COPY . .
RUN pnpm deploy --filter=fp-next /usr/src/next

FROM base AS dev
WORKDIR /app
COPY --from=build /usr/src/next /app
CMD ["pnpm", "run", "dev"]

