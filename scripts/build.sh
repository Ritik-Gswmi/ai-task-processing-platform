#!/bin/bash

echo "Building Docker Images..."

docker build -t ai-platform-frontend ./frontend
docker build -t ai-platform-backend ./backend
docker build -t ai-platform-worker ./worker

echo "All images built successfully!"
