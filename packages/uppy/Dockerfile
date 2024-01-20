FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base as build
COPY ./packages/uppy/package.json ./
COPY ./packages/uppy/index.js ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

FROM build as run
ENTRYPOINT ["pnpm"]
CMD ["start"]

