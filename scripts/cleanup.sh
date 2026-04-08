#!/bin/bash

echo "Cleaning Kubernetes resources..."

kubectl delete namespace ai-platform

echo "Cleanup completed."
