FROM node:16

WORKDIR /app

COPY ../package.json yarn.lock ./
RUN yarn

COPY ../tsconfig.json /app/
COPY ../src /app/src

RUN yarn prod:build

CMD yarn prod:run
