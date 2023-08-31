# Step 1: Build the app in a node environment
FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Run the app in a lighter alpine environment
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy files for data migration
COPY migrate-mongo-config.js ./
COPY migrations ./migrations

# Copy compiled app from the builder
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# Run data migrations before starting app
CMD sh -c "npx migrate-mongo up && node dist/main.js"

