FROM oven/bun@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

FROM gcr.io/distroless/base@sha256:0e48b9bcd868bce9fa872cee10b52961d9e32677823da4bf68eefb44f38e7b9d

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
