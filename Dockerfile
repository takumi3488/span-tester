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

FROM gcr.io/distroless/base@sha256:44a80dc28b49f47396e72ab2dc644b3f849880335de09625762faed207bb891d

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
