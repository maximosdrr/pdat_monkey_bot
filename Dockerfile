FROM node:alpine

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .