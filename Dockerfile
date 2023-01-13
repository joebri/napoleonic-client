FROM node:19.4.0-bullseye-slim as base

RUN \
  apt-get update && \ 
  apt-get install -y --no-install-recommends

EXPOSE 3000

RUN npm install -g serve

WORKDIR /app

COPY --chown=node:node package*.json ./



FROM base as production
ENV \
  NODE_ENV=production

# RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node ./build .

USER node
CMD [ "npm", "run", "docker:serve" ]

