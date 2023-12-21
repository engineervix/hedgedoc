FROM node:18.18.2-bullseye

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
RUN mkdir -p /home/node/config && chown -R node:node /home/node/config

# Set the working directory in the container
WORKDIR /home/node/app

# Port used by this container to serve HTTP.
EXPOSE 8000

# set environment variables
ARG CMD_DOMAIN \
    CMD_SESSION_SECRET \
    CMD_ALLOW_ORIGIN \
    CMD_S3_ACCESS_KEY_ID \
    CMD_S3_SECRET_ACCESS_KEY \
    CMD_S3_REGION \
    CMD_S3_BUCKET \
    CMD_S3_ENDPOINT \
    CMD_DB_NAME \
    CMD_DB_PASS \
    CMD_DB_USER \
    CMD_DB_HOST \
    CMD_DB_PORT \
    CMD_DB_URL
ENV PORT=8000 \
    CMD_PORT=8000 \
    CMD_IMAGE_UPLOAD_TYPE=s3 \
    CMD_ALLOW_ANONYMOUS=false \
    CMD_PROTOCOL_USESSL=true \
    CMD_URL_ADDPORT=false \
    CMD_ALLOW_EMAIL_REGISTER=false \
    CMD_DB_DIALECT=postgres \
    NODE_ENV=production \
    CMD_DOMAIN=${CMD_DOMAIN} \
    CMD_SESSION_SECRET=${CMD_SESSION_SECRET} \
    CMD_ALLOW_ORIGIN=${CMD_ALLOW_ORIGIN} \
    CMD_S3_ACCESS_KEY_ID=${CMD_S3_ACCESS_KEY_ID} \
    CMD_S3_SECRET_ACCESS_KEY=${CMD_S3_SECRET_ACCESS_KEY} \
    CMD_S3_REGION=${CMD_S3_REGION} \
    CMD_S3_BUCKET=${CMD_S3_BUCKET} \
    CMD_S3_ENDPOINT=${CMD_S3_ENDPOINT} \
    CMD_DB_NAME=${CMD_DB_NAME} \
    CMD_DB_PASS=${CMD_DB_PASS} \
    CMD_DB_USER=${CMD_DB_USER} \
    CMD_DB_HOST=${CMD_DB_HOST} \
    CMD_DB_PORT=${CMD_DB_PORT} \
    CMD_DB_URL=${CMD_DB_URL} \
    # necessary on ARM because puppeteer doesn't provide a prebuilt binary
    PUPPETEER_SKIP_DOWNLOAD=true

# Yarn 3 requires corepack to be enabled
RUN corepack enable

# Switch to the non-root user
USER node

# Copy the code to the container
COPY --chown=node:node . .

# Install the application dependencies
RUN yarn install --immutable

# # Build the frontend bundle
RUN yarn run build \
  && yarn workspaces focus --production

# Runtime command that executes when "docker run" is called
# do nothing forever - exec commands elsewhere
CMD tail -f /dev/null
