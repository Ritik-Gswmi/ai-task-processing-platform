# Stage 1: build the app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app (Vite outputs to 'dist')
RUN npm run build

# Stage 2: serve with nginx
FROM nginxinc/nginx-unprivileged:alpine

# Switch to root for image assembly steps (base image defaults to non-root).
USER root

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.config /etc/nginx/conf.d/default.conf

# Ensure runtime user can read served files/config
RUN chown -R 101:101 /usr/share/nginx/html /etc/nginx/conf.d

# Run unprivileged
USER 101

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
