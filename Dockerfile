FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "start"]
