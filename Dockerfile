FROM arm64v8/node:16.20-bullseye-slim

# necessary on ARM because puppeteer doesn't provide a prebuilt binary
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/tmp/.yarn

RUN mkdir -p /app && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Install Yarn globally
RUN npm install -g yarn@3

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of your application code to the container
COPY --chown=node:node . .

ENV PATH ./node_modules/.bin:$PATH

# Expose the port your Node.js application will run on (if necessary)
# EXPOSE 3000

# Define the command to start your Node.js application
# CMD ["yarn", "start"]
