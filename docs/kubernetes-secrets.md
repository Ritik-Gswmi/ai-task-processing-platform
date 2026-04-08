# Kubernetes Secrets (JWT_SECRET)

This repo does **not** commit real secrets.

The backend expects a Kubernetes Secret named `ai-platform-secrets` with key `JWT_SECRET`.

## Create in cluster (manual)

```sh
kubectl -n ai-task-processing-platform create secret generic ai-platform-secrets \
  --from-literal=JWT_SECRET='replace-with-strong-random-string'
```

If you need to rotate:

```sh
kubectl -n ai-task-processing-platform delete secret ai-platform-secrets
kubectl -n ai-task-processing-platform create secret generic ai-platform-secrets \
  --from-literal=JWT_SECRET='new-strong-random-string'
```

## GitOps options (recommended for production)

- SealedSecrets (Bitnami)
- External Secrets Operator (AWS/GCP/Azure vaults)

`infrastructure/kubernetes/base/secret.example.yaml` is only a template.

