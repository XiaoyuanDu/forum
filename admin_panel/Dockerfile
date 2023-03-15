FROM node:19-alpine

COPY . .
RUN yarn install

EXPOSE 3001
RUN yarn build
CMD ["yarn", "start"]
# FROM node:16 AS build