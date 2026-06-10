FROM node:22-alpine AS base
WORKDIR /app

COPY ./dist dist/
COPY package*.json .

# 国内构建加速：npm 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com

RUN npm ci --omit=dev

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs