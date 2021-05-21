FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY tsconfig.json /app/

CMD yarn dev:run
