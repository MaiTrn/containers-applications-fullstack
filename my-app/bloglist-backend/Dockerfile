FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm uninstall bcrypt

RUN npm install bcrypt

USER node

CMD npm start