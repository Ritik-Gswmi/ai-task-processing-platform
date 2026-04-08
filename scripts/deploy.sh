#!/bin/bash

echo "Deploying AI Task Platform to Kubernetes..."

kubectl apply -f infrastructure/kubernetes/namespace.yaml

kubectl apply -f infrastructure/kubernetes/mongodb/
kubectl apply -f infrastructure/kubernetes/redis/

kubectl apply -f infrastructure/kubernetes/backend/
kubectl apply -f infrastructure/kubernetes/frontend/
kubectl apply -f infrastructure/kubernetes/worker/

kubectl apply -f infrastructure/kubernetes/ingress/

echo "Deployment completed!"
