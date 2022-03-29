FROM node:alpine

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

RUN npx prisma generate

COPY . .