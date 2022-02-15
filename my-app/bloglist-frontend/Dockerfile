FROM node:16 as base

WORKDIR /usr/src/app

COPY . .

RUN npm ci

FROM base as test

COPY --from=base /usr/src/app .

ENV CI=true

RUN npm run test

FROM test as build-stage

COPY --from=test /usr/src/app .

ENV REACT_APP_BACKEND_URL=http://localhost:5000/

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html