# Deployment Guide

## Local Development

Run using Docker Compose

docker-compose -f infrastructure/docker/docker-compose.yml up --build

Services started:

Frontend
Backend
Worker
Redis
MongoDB

---

## Kubernetes Deployment

Apply manifests

kubectl apply -f infrastructure/kubernetes/

---

## ArgoCD Deployment

Apply ArgoCD application

kubectl apply -f infrastructure/argocd/application.yaml

ArgoCD will automatically sync the platform.

---

## Access Platform

Frontend:
http://localhost

Backend API:
http://localhost/api
