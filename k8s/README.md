# Kubernetes Deployment for Admin UI

This directory contains Kubernetes manifests for deploying the Admin UI application.

## Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured to access your cluster
- Docker image built and pushed to your registry
- nginx ingress controller (optional, for Ingress)
- metrics-server (optional, for HPA)

## Configuration

Before deploying, update the following values:

### Secret (`secret.yaml`)
Update Auth0 configuration (sensitive data stored in Secret):
- `VITE_AUTH0_DOMAIN`: Your Auth0 domain
- `VITE_AUTH0_CLIENT_ID`: Your Auth0 client ID
- `VITE_AUTH0_AUDIENCE`: Your Auth0 API audience

**Note**: In production, consider using external secret management solutions like:
- Sealed Secrets
- External Secrets Operator
- HashiCorp Vault
- AWS Secrets Manager / Azure Key Vault / GCP Secret Manager

### Ingress (`ingress.yaml`)
- Update `host` to your domain
- Configure TLS if needed
- Adjust annotations based on your ingress controller

### Kustomization (`kustomization.yaml`)
- Update `newName` with your Docker registry path
- Update `newTag` with your desired image tag
- Namespace is set to `tacokumo` by default

## Building the Docker Image

```bash
# Build with build args
docker build \
  --build-arg VITE_AUTH0_DOMAIN=your-domain.auth0.com \
  --build-arg VITE_AUTH0_CLIENT_ID=your-client-id \
  --build-arg VITE_AUTH0_AUDIENCE=your-audience \
  -t your-registry/admin-ui:latest \
  .

# Push to registry
docker push your-registry/admin-ui:latest
```

## Deployment Options

### Option 1: Using Kustomize (Recommended)

```bash
# Create namespace first if it doesn't exist
kubectl create namespace tacokumo

# Deploy using kustomize
kubectl apply -k k8s/

# Verify deployment
kubectl get all -l app=admin-ui -n tacokumo

# Check pods
kubectl get pods -l app=admin-ui -n tacokumo
```

### Option 2: Using kubectl directly

```bash
# Create namespace first
kubectl create namespace tacokumo

# Apply manifests individually
kubectl apply -f k8s/secret.yaml -n tacokumo
kubectl apply -f k8s/deployment.yaml -n tacokumo
kubectl apply -f k8s/service.yaml -n tacokumo
kubectl apply -f k8s/ingress.yaml -n tacokumo
kubectl apply -f k8s/hpa.yaml -n tacokumo
```

## Resources

### Deployment (`deployment.yaml`)
- **Replicas**: 2 (for high availability)
- **Image**: Configurable via kustomization
- **Health Checks**:
  - Liveness probe on `/health`
  - Readiness probe on `/health`
- **Resources**:
  - Requests: 100m CPU, 128Mi memory
  - Limits: 200m CPU, 256Mi memory

### Service (`service.yaml`)
- **Type**: ClusterIP (internal access only)
- **Port**: 80

### Ingress (`ingress.yaml`)
- Exposes the application externally
- Supports TLS termination
- Path-based routing to service

### HorizontalPodAutoscaler (`hpa.yaml`)
- **Min replicas**: 2
- **Max replicas**: 10
- **Metrics**: CPU (70%), Memory (80%)
- Scale up/down policies configured for stability

## Monitoring

```bash
# Check deployment status
kubectl rollout status deployment/admin-ui -n tacokumo

# View logs
kubectl logs -l app=admin-ui --tail=100 -f -n tacokumo

# Describe deployment
kubectl describe deployment admin-ui -n tacokumo

# Check HPA status
kubectl get hpa admin-ui -n tacokumo

# Check ingress
kubectl get ingress admin-ui -n tacokumo
```

## Updating the Deployment

```bash
# Update image tag in kustomization.yaml, then:
kubectl apply -k k8s/

# Or use kubectl set image
kubectl set image deployment/admin-ui admin-ui=your-registry/admin-ui:v1.2.3 -n tacokumo

# Check rollout status
kubectl rollout status deployment/admin-ui -n tacokumo

# Rollback if needed
kubectl rollout undo deployment/admin-ui -n tacokumo
```

## Scaling

```bash
# Manual scaling (will be overridden by HPA if enabled)
kubectl scale deployment admin-ui --replicas=5 -n tacokumo

# View HPA metrics
kubectl get hpa admin-ui -w -n tacokumo
```

## Troubleshooting

```bash
# Check pod status
kubectl get pods -l app=admin-ui -n tacokumo

# Check pod logs
kubectl logs <pod-name> -n tacokumo

# Describe pod for events
kubectl describe pod <pod-name> -n tacokumo

# Execute into pod for debugging
kubectl exec -it <pod-name> -n tacokumo -- /bin/sh

# Check service endpoints
kubectl get endpoints admin-ui -n tacokumo

# Test service internally
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n tacokumo -- \
  curl http://admin-ui.tacokumo.svc.cluster.local/health
```

## Cleanup

```bash
# Delete all resources
kubectl delete -k k8s/

# Or delete individually
kubectl delete -f k8s/
```
