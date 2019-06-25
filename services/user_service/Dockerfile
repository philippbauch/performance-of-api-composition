# This Dockerfile must be executed from the project root via docker-compose to work correctly.
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN ["npm", "install"]

COPY . ./

RUN ls -la

RUN ["npm", "run", "build"]

CMD [ "npm", "start" ]
