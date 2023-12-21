FROM node:18.18.2-bullseye

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
RUN mkdir -p /home/node/config && chown -R node:node /home/node/config

# Set the working directory in the container
WORKDIR /home/node/app

# Port used by this container to serve HTTP.
EXPOSE 8000

# set environment variables
ENV PORT=8000 \
    NODE_ENV=production \
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
