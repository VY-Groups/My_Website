# Docker Deployment Guide for Portfolio React App

## Quick Start with Docker Compose (Recommended)

### Build and run the container:
```bash
docker-compose up --build
```

### Run in background:
```bash
docker-compose up -d --build
```

### Stop container:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

---

## Manual Docker Build

### Build image:
```bash
docker build -t portfolio-app .
```

### Run container:
```bash
docker run -p 3000:80 --name portfolio-app portfolio-app
```

### Run in background:
```bash
docker run -d -p 3000:80 --name portfolio-app portfolio-app
```

### Stop container:
```bash
docker stop portfolio-app
```

### View logs:
```bash
docker logs -f portfolio-app
```

### Remove container:
```bash
docker rm portfolio-app
```

### Remove image:
```bash
docker rmi portfolio-app
```

---

## Access Your App

Open your browser and go to:
- **http://localhost:3000** (or **http://localhost** if using port 80)

---

## Features Included

✅ Multi-stage Docker build (optimized for production)
✅ Nginx web server for optimal performance
✅ Gzip compression enabled
✅ SPA routing support (routes fallback to index.html)
✅ Security headers included
✅ Health checks enabled
✅ Docker Compose for easy orchestration
✅ Static asset caching (1 year for CSS, JS, images)
✅ Proper error handling

---

## Production Build Process

The Dockerfile does the following:

1. **Builder Stage**:
   - Uses Node 20 Alpine
   - Installs npm dependencies
   - Runs `npm run build` to create optimized dist/
   - Creates smaller production image

2. **Production Stage**:
   - Uses Nginx Alpine (lightweight)
   - Copies only the built dist/ folder
   - Configures Nginx for SPA
   - Adds security headers
   - Sets up caching for static assets

---

## Environment

- `NODE_ENV`: production (automatically set)
- Port: 80 (inside container) → 3000 (on host)

---

## File Structure

```
My_Website_React/
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # Docker Compose config
├── nginx.conf          # Nginx configuration
├── .dockerignore        # Files to exclude from Docker
├── src/
├── dist/               # Built app (generated)
├── package.json
└── vite.config.js
```

---

## Troubleshooting

### Port already in use:
```bash
# Change port in docker-compose.yml
# From: ports: - "3000:80"
# To:   ports: - "8080:80"
```

### Container won't start:
```bash
docker-compose logs -f  # Check logs for errors
docker-compose down     # Stop
docker-compose up --build  # Rebuild
```

### Clear everything and restart:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

---

## Performance Tips

- Nginx serves static files efficiently
- Gzip compression reduces transfer size
- Browser caching enabled for static assets
- Multi-stage build keeps image size small
- Health checks monitor container status

---

## Next Steps

1. Build: `docker-compose up --build`
2. Test: Open http://localhost:3000
3. Push to Docker Hub (optional):
   ```bash
   docker build -t yourusername/portfolio-app .
   docker push yourusername/portfolio-app
   ```
4. Deploy to cloud (AWS, Azure, GCP, etc.)
