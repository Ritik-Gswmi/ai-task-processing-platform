# Architecture Document — AI Task Processing Platform

**Author:** Ritik Kumar  
**Last updated:** 2026-03-14

## 1) Overview

This project is a small “AI task processing” platform built to demonstrate production-style engineering practices:

- **MERN-style app**: React frontend + Node/Express backend + MongoDB.
- **Async task execution**: backend enqueues work to **Redis**, a Python **worker** consumes it and writes results back to MongoDB.
- **GitOps delivery**: Kubernetes manifests are stored in a separate **infra repo** and deployed via **Argo CD**.
- **CI/CD**: GitHub Actions builds images, pushes them to Docker Hub, and (optionally) updates image tags in the infra repo automatically.

The “AI operations” are intentionally simple (uppercase/lowercase/reverse/wordcount) to focus on async processing + deployment.

## 2) High-level Architecture

### Components

1. **Frontend (React + Vite, Nginx)**
   - Serves the UI (login/register, dashboard, create tasks, view status/results).
   - Calls backend via `/api/*` (through Ingress).
   - Polls tasks periodically to show status updates.

2. **Backend (Node.js + Express)**
   - JWT auth endpoints (`/api/auth/*`).
   - Task endpoints (`/api/tasks`):
     - Create task record in MongoDB (`status=pending`).
     - Push job to Redis queue (`task_queue` list).
   - Health endpoints for Kubernetes probes:
     - `/healthz` (process alive)
     - `/readyz` (MongoDB connected)

3. **Worker (Python)**
   - Blocks on Redis queue (`BLPOP`).
   - Updates MongoDB task status:
     - `pending → processing → completed/failed`
   - Writes `result` to MongoDB.

4. **MongoDB**
   - Source of truth for tasks and users.
   - Stores task state, timestamps, and results.

5. **Redis**
   - Queueing layer for async background jobs.
   - Decouples user request latency from processing latency.

### Request flow

1) User submits task in UI  
2) Backend validates input + stores `Task(status=pending)` in MongoDB  
3) Backend enqueues `{task_id, operation, input}` into Redis list `task_queue`  
4) Worker `BLPOP`s the job, processes it, then updates MongoDB with `status` + `result`  
5) Frontend polls `/api/tasks` and renders updated status/result

## 3) Worker Scaling Strategy

### Horizontal scaling (multiple worker replicas)

- Workers are **stateless** and can be scaled via Kubernetes `replicas`.
- Because each job is removed from the list with `BLPOP`, only one worker processes a given job (at-least-once delivery is achieved by design; see failure handling below).

**How to scale:**
- Increase `spec.replicas` in the `worker` Deployment (kustomize overlay or via Argo CD).

### Throughput considerations

Scaling works best when:
- Worker processing is CPU-bound or IO-bound enough to benefit from concurrency.
- Redis and MongoDB can handle the increased read/write rate.

If tasks become heavier (real AI calls), also scale:
- backend replicas (ingress-facing)
- redis (or move to managed Redis)
- MongoDB (managed Mongo/replica set with proper resources)

## 4) Handling High Task Volume (e.g., 100k tasks/day)

100k/day ≈ ~1.16 tasks/second on average, but real traffic is bursty. The design supports bursts by buffering in Redis.

### Queueing & backpressure

- Redis queue provides buffering; backend remains responsive.
- If queue grows, scale workers horizontally.

### Recommended improvements for higher volume

For “real production” and large bursts:

1. **Reliable queue semantics**
   - Current queue is a Redis list + `BLPOP`.
   - For stronger reliability, use:
     - Redis Streams (with consumer groups), or
     - BullMQ end-to-end (Node producers + workers), or
     - A managed broker (RabbitMQ/Kafka) if needed.

2. **Idempotency**
   - Ensure worker processing is idempotent for a given `task_id`.
   - If the worker crashes after processing but before updating MongoDB, the job can be retried and should not corrupt state.

3. **Rate limits**
   - Limit task creation per user (backend) to protect resources.

4. **Connection pooling**
   - Use stable MongoDB/Redis connections and tune pool sizes for concurrency.

## 5) Database Indexing Strategy (MongoDB)

The most common backend query is:

- “Fetch tasks for a user”: `Task.find({ userId: <user> })`

Recommended indexes:

1) `tasks` collection:
- `{ userId: 1, createdAt: -1 }` for dashboard listing and sorting.
- Optional: `{ userId: 1, status: 1, createdAt: -1 }` if you add status filters.

2) `users` collection:
- Unique index on `email` (or username) for fast login and uniqueness.

Why it matters:
- Without indexes, scans will get slower as tasks grow.
- Indexing supports predictable latency even under load.

## 6) Handling Redis Failure

Redis is a runtime dependency for async processing.

### Failure modes

1) **Redis down (enqueue fails)**
   - Backend should return an error when it cannot enqueue (or mark task failed immediately).
   - Operationally: Redis pod restart or switch to managed Redis.

2) **Redis down (worker cannot dequeue)**
   - Worker will block/fail; tasks remain `pending` in MongoDB until Redis returns.

3) **Redis data loss (non-persistent)**
   - If Redis restarts and queue data is lost, tasks that were “pending” but not processed will be stuck.
   - Mitigation:
     - Enable Redis persistence (AOF/RDB) and/or use a managed Redis service.
     - Add a “reconciliation” job: periodically find tasks `pending/processing` older than X minutes and retry or mark failed.

### Recommended production approach

- Use a persistent queue (Streams, BullMQ with proper config, or managed broker).
- Add retries + dead-letter handling for poison messages.

## 7) Environments: Staging vs Production

Kustomize overlays are used to represent environments:

- `base/`: shared resources (namespace, Deployments, Services, ConfigMap, Ingress)
- `overlays/staging/`: smaller replica counts and staging tags
- `overlays/prod/`: production tags and replica defaults
- `overlays/docker-desktop/`: Ingress class tuned for local Docker Desktop (nginx)

Typical approach:
- **Staging**: auto-deploy from `staging` tags (or a staging branch).
- **Production**: deploy from `latest` or immutable SHA tags after approval.

## 8) Kubernetes Design Notes

### Namespacing

- All workloads run inside `ai-task-processing-platform` namespace.

### Configuration & secrets

- Non-sensitive config: `ConfigMap` (`MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`).
- Sensitive config: Kubernetes `Secret` (created manually or via SealedSecrets/ExternalSecrets):
  - `ai-platform-secrets` with `JWT_SECRET`.

### Probes & resources

- Backend has `/healthz` and `/readyz` probes.
- Resources requests/limits are set to avoid noisy-neighbor issues and aid scheduling.

### Scaling

- Backend and frontend scale by replicas behind ClusterIP Services.
- Worker scales horizontally (multiple replicas consuming the queue).

## 9) CI/CD + GitOps (Argo CD)

### CI (GitHub Actions)

- Runs frontend lint.
- Builds and pushes Docker images:
  - `ai-task-processing-platform-frontend`
  - `ai-task-processing-platform-backend`
  - `ai-task-processing-platform-worker`
- Optionally updates the infra repo’s kustomize image tags to the new commit SHA.

### CD (Argo CD)

- Argo CD watches the infra repo path (overlay) and auto-syncs changes.
- Auto-sync settings:
  - `prune: true` (remove obsolete resources)
  - `selfHeal: true` (reconcile drift)

## 10) Security Considerations

Implemented:
- Password hashing using bcrypt.
- JWT auth for protected endpoints.
- Kubernetes secret for `JWT_SECRET` (not committed to Git).

Recommended additions (production hardening):
- Helmet middleware for security headers.
- Rate limiting for auth + task creation endpoints.
- Strong JWT secret rotation strategy (invalidate old tokens).
- Separate service accounts and RBAC policies in Kubernetes.
- Network policies (deny-by-default).

## 11) Observability (Recommended)

For a production-grade setup:
- Centralized logs (Loki/ELK).
- Metrics (Prometheus + Grafana).
- Tracing (OpenTelemetry).
- Alerts on:
  - queue size / processing latency
  - worker crash loops
  - backend error rate
  - MongoDB/Redis health

## 12) Known Trade-offs / Next Improvements

- Queue is implemented as a Redis list for simplicity; Streams/BullMQ would provide better durability and observability.
- Task “logs” can be extended to store real step-by-step worker logs in MongoDB.
- Replace polling with WebSockets/SSE for real-time updates at scale.

