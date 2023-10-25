FROM arm64v8/node:16.20-bullseye

# necessary on ARM because puppeteer doesn't provide a prebuilt binary
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/tmp/.yarn

RUN mkdir -p /app && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the application dependencies
RUN corepack enable \
  && corepack prepare yarn@3.x --activate \
  && yarn set version 3.x \
  && yarn install

# Copy the rest of your application code to the container
COPY --chown=node:node . .

ENV PATH ./node_modules/.bin:$PATH

# Expose the port your Node.js application will run on (if necessary)
# EXPOSE 3000

# Define the command to start your Node.js application
CMD ["yarn", "start"]
