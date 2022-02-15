FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

# with yarn
# RUN yarn install --immutable --immutable-cache --check-cache

ENV DEBUG=todo-backend:*

USER node

CMD npm start
