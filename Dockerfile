FROM node:16.20-bullseye

# necessary on ARM because puppeteer doesn't provide a prebuilt binary
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

RUN mkdir -p /app && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Port used by this container to serve HTTP.
EXPOSE 8000

# We provide these as build args because pm2 somehow doesn't pick up runtime env vars
# However, this is not cool because we are repeating ourselves
ARG CMD_DB_URL
ARG CMD_DOMAIN
ARG CMD_SESSION_SECRET
ARG CMD_PROTOCOL_USESSL
ARG CMD_PORT
ARG CMD_ALLOW_ANONYMOUS
ARG CMD_ALLOW_EMAIL_REGISTER
ARG CMD_S3_ACCESS_KEY_ID
ARG CMD_S3_SECRET_ACCESS_KEY
ARG CMD_S3_REGION
ARG CMD_S3_BUCKET
ARG CMD_S3_ENDPOINT

# set environment variables
ENV PORT=8000 \
    PATH=./node_modules/.bin:$PATH \
    CMD_DB_URL=$CMD_DB_URL \
    CMD_DOMAIN=$CMD_DOMAIN \
    CMD_SESSION_SECRET=$CMD_SESSION_SECRET \
    CMD_PROTOCOL_USESSL=$CMD_PROTOCOL_USESSL \
    CMD_PORT=$CMD_PORT \
    CMD_ALLOW_ANONYMOUS=$CMD_ALLOW_ANONYMOUS \
    CMD_ALLOW_EMAIL_REGISTER=$CMD_ALLOW_EMAIL_REGISTER \
    CMD_S3_ACCESS_KEY_ID=$CMD_S3_ACCESS_KEY_ID \
    CMD_S3_SECRET_ACCESS_KEY=$CMD_S3_SECRET_ACCESS_KEY \
    CMD_S3_REGION=$CMD_S3_REGION \
    CMD_S3_BUCKET=$CMD_S3_BUCKET \
    CMD_S3_ENDPOINT=$CMD_S3_ENDPOINT

# Yarn 3 requires corepack to be enabled
RUN corepack enable

# Switch to the non-root user
USER node

# Copy the code to the container
COPY --chown=node:node . .
# COPY --chown=node:node config.json.example config.json

# Install the application dependencies
RUN yarn install --immutable

# # Build the frontend bundle
RUN yarn run build \
  && yarn workspaces focus --production

# Runtime command that executes when "docker run" is called
CMD yarn start
