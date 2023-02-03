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
  NODE_ENV=production \
  REACT_APP_SENTRY_DSN='https://5b264e7f43b94f70817ae332884bb1bc@o4504602899251200.ingest.sentry.io/4504602995130369' \
  REACT_APP_SENTRY_ENABLED=true \
  REACT_APP_SENTRY_ENVIRONMENT='production' \
  REACT_APP_WEBVITALS_ENABLED=false

# RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node ./build .

USER node
CMD [ "npm", "run", "docker:serve" ]

