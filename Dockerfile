# Step 1: Build the app in a node environment
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Step 2: Run the app in a lighter alpine environment
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for necessary production dependencies
COPY package*.json tsconfig.json ./

# Install only production dependencies
RUN npm install

# Copy compiled app from the builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose the listening port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
