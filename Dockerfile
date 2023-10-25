FROM node:16.20-bullseye

# necessary on ARM because puppeteer doesn't provide a prebuilt binary
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

RUN mkdir -p /app && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Port used by this container to serve HTTP.
EXPOSE 8000

# set environment variables
ENV PORT=8000 \
    PATH=./node_modules/.bin:$PATH

# Yarn 3 requires corepack to be enabled
RUN corepack enable \
  && yarn set version 3.6.4

# Switch to the non-root user
USER node

# Copy the code to the container
COPY --chown=node:node . .

# Install the application dependencies
RUN yarn install --immutable

# Build the frontend bundle
RUN yarn run build \
  && yarn workspaces focus --production

# Runtime command that executes when "docker run" is called
CMD yarn start
