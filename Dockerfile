# Credit to Tom Rowe https://gist.github.com/TheRealFlyingCoder/773bf60f433ccbdbad8c296a99fb3738
ARG NODE_VERSION=20.9.0
# base node image

FROM node:20.9.0-bullseye-slim as base
# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps


WORKDIR /app

ADD package.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json  ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production


WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
#My build goes to /app/server/build and i'm running /server/index.js express
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json



# drop the posts for the gcloud build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
