
# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production
RUN npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata

COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Run the application
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]
