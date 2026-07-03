# VocalizeAI Studio — Production Deployment Procedures

## Quick Deploy (Static Site Hosting)

The entire application compiles to a **single self-contained HTML file** (`dist/index.html`). Deploy it to any static host.

### Option A: Netlify / Vercel / Cloudflare Pages

```bash
npm run build
```

Deploy the `dist/` directory. On Cloudflare Pages, the build command is:
```
npm run build
```
Output directory:
```
dist
```

### Option B: AWS S3 + CloudFront

```bash
npm run build

aws s3 cp dist/index.html s3://your-bucket/ \
  --content-type "text/html" \
  --cache-control "public, max-age=3600"
```

### Option C: Bare nginx Container

```dockerfile
FROM nginx:alpine
COPY dist/index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t vocalizeai-studio .
docker run -p 8080:80 vocalizeai-studio
```

---

## Self-Hosted Backend Deployment

### Prerequisites

- NVIDIA GPU server with CUDA 12.2+ driver (A10G, L4, T4, or H100)
- Docker Engine 24+ with NVIDIA Container Toolkit
- Redis and PostgreSQL (or the bundled docker-compose services)

### Step 1: Clone the backend

```bash
git clone https://github.com/your-org/voiceapi.git
cd voiceapi
```

### Step 2: Configure environment

Create `.env`:
```
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql://user:voicepass@postgres:5432/voicedb
CUDA_VISIBLE_DEVICES=0
HUGGINGFACE_TOKEN=hf_your_token_here
```

### Step 3: Launch production stack

```bash
docker-compose up -d
```

This starts:
- **api** — FastAPI server on port 8000 (REST + WebSocket)
- **redis** — Job queue and API key cache
- **postgres** — Usage records and billing data

### Step 4: Verify

```bash
curl http://localhost:8000/docs            # OpenAPI docs
curl -X POST http://localhost:8000/v1/listen \
  -H "Authorization: Token vk_live_YOUR_KEY" \
  -F "file=@test.wav"
```

### Step 5: Scale horizontally

```bash
docker-compose up -d --scale api=4
```

---

## Kubernetes Production Deployment

The `ApiManifestStudio` tab exposes the full Kubernetes manifests. Key details:

### GPU Node Pool

```yaml
resources:
  limits:
    nvidia.com/gpu: 1      # Dedicated GPU per pod
    memory: "24Gi"
  requests:
    nvidia.com/gpu: 1
    memory: "16Gi"
```

### Auto-Scaling Configuration

```yaml
minReplicas: 2
maxReplicas: 16
metrics:
  - type: External
    external:
      metric:
        name: container_gpu_utilization
      target:
        averageValue: "75"      # Scale when GPU > 75%
```

### WebSocket Ingress (Critical for Streaming ASR)

```yaml
annotations:
  nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
  nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  nginx.ingress.kubernetes.io/websocket-services: "vocalizeai-gpu-workers"
```

The 3600-second timeout is essential for long-lived WebSocket audio streaming sessions.

---

## RunPod / Modal / Serverless GPU

### RunPod Template

1. Create a pod using the `ghcr.io/vocalizeai/server:v3.4.0` image
2. Select GPU: NVIDIA A10G (24GB) or L4 (24GB)
3. Expose port `8000` (HTTP/WS)
4. Set environment variables from the `.env` file above
5. Wire your DNS (e.g., `api.yourdomain.io`) to the RunPod's public IP

### Modal

```python
import modal

app = modal.App("vocalizeai-api")
image = modal.Image.debian_slim().pip_install_from_requirements("requirements.txt")

@app.function(gpu="A10G", image=image)
@modal.asgi_app()
def fastapi_app():
    from app.main import app
    return app
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_URL` | Yes | Redis connection string for job queue |
| `DATABASE_URL` | Yes | PostgreSQL connection for usage/billing |
| `CUDA_VISIBLE_DEVICES` | Optional | GPU device ordinal |
| `HUGGINGFACE_TOKEN` | Yes* | Required for pyannote diarization models |
| `MODEL_NAME` | No | Default: `large-v3` |
| `COMPUTE_TYPE` | No | Default: `float16` |
| `MAX_CONCURRENT_WEBSOCKETS` | No | Default: 32 per GPU worker |

---

## Observability

- **OpenAPI docs**: Available at `http://your-host:8000/docs`
- **Health check**: `GET /health` returns `{"status": "ok", "gpu_memory_gb": 14.2}`
- **GPU metrics**: Exposed via `nvidia-smi` on `/metrics` for Prometheus scraping
- **Usage records**: Query the `usage_records` table in Postgres for per-key billing aggregation
