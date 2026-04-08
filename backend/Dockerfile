# Use Node 20
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Run as non-root
USER node

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
