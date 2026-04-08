# AI Task Processing Platform

A distributed platform for processing text “AI tasks” asynchronously using a MERN-style stack + a Python worker.

## Features

* User registration & login (JWT)
* Create tasks (uppercase, lowercase, reverse, word count)
* Async processing via Redis queue + Python worker
* Task status + results in MongoDB

---

## Live Deployment

* **Frontend (React UI)**
  https://your-frontend-url.vercel.app

* **Backend API**
  https://your-backend-url.onrender.com

---

## Architecture

* Frontend: React (Vite) served by Nginx
* Backend: Node.js + Express API
* Worker: Python background processor
* Queue: Redis (task queue)
* DB: MongoDB (tasks/users)
* Deploy: Docker Compose (local) + Kubernetes (GitOps via Argo CD)
* CI/CD: GitHub Actions builds/pushes images and updates infra repo image tags

---

## Project Structure

* `frontend/` → React UI
* `backend/` → Node.js API
* `worker/` → Python worker
* `infrastructure/docker/` → Docker Compose for local dev
* `infrastructure/argocd/` → Argo CD Application manifest (points to infra repo)
* `scripts/` → automation scripts (CI helper)
* `docs/` → documentation

---

## Screenshots

### Login Page

![Login Screenshot](docs/screenshots/login.png)

### Dashboard

![Dashboard Screenshot](docs/screenshots/dashboard.png)

### Task Creation

![Task Screenshot](docs/screenshots/create-task.png)

### Task Processing Result

![Result Screenshot](docs/screenshots/result.png)

---

## Local Setup

From repo root:

```sh
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

---

## Kubernetes Deployment

This project uses **two repos** for GitOps:

* App repo (this): builds Docker images
* Infra repo: stores Kubernetes manifests (`base/` + `overlays/`) consumed by Argo CD

### 1) Install ingress controller (Docker Desktop Kubernetes)

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

### 2) Install Argo CD

```sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 3) Create required Kubernetes Secret

Backend expects:

* Secret name: `ai-platform-secrets`
* Key: `JWT_SECRET`

```sh
kubectl -n ai-task-processing-platform create secret generic ai-platform-secrets \
  --from-literal=JWT_SECRET='replace-with-strong-random-string'
```

### 4) Create Argo CD Application

Update `infrastructure/argocd/application.yml` to point to your infra repo and the correct overlay path, then apply:

```sh
kubectl apply -f infrastructure/argocd/application.yml
```

### 5) Access Argo CD UI (local)

```sh
kubectl -n argocd port-forward svc/argocd-server 8090:443
```

Open `https://localhost:8090` (self-signed cert warning is expected).

### 6) Access the app (local)

If using ingress-nginx on Docker Desktop, port-forward the ingress controller:

```sh
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8080:80
```

Add hosts entry:

* `127.0.0.1 ai-task-processing-platform.local`

Open:

* `http://ai-task-processing-platform.local:8080`

---

## CI/CD

GitHub Actions:

* lints frontend
* builds & pushes Docker images to Docker Hub
* auto-updates image tags in the infra repo (kustomize overlays)

Required GitHub Actions secrets (app repo):

* `DOCKER_USERNAME`
* `DOCKER_PASSWORD` (Docker Hub access token recommended)
* `INFRA_REPO` (e.g. `Ritik-Gswmi/ai-task-processing-platform-infra`)
* `INFRA_REPO_TOKEN` (GitHub PAT with write access to infra repo)

---

## Author

Ritik Kumar
