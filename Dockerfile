FROM arm64v8/node:16.20-bullseye

# necessary on ARM because puppeteer doesn't provide a prebuilt binary
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/tmp/.yarn

RUN mkdir -p /app && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Port used by this container to serve HTTP.
EXPOSE 8000

# set environment variables
ENV PORT=8000 \
    PATH=./node_modules/.bin:$PATH

# Switch to the non-root user
USER node

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the application dependencies
RUN corepack enable \
  && yarn set version 3.6.4 \
  && yarn install --inline-builds

# Copy the rest of the code to the container
COPY --chown=node:node . .

# Runtime command that executes when "docker run" is called
CMD yarn start
