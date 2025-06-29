# Deployment Guide

## Overview

This guide covers deployment strategies for the Link application, including development, staging, and production environments.

## Architecture Summary

- **Backend**: Node.js/Express API server
- **Frontend**: Next.js static site with API integration
- **Database**: MongoDB (Atlas recommended for production)
- **File Storage**: Cloudinary for images
- **Environment**: Docker containerization supported

## Environment Configuration

### Development Environment

**Backend (.env)**
```bash
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/link
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/link

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_development_jwt_secret
BCRYPT_ROUNDS=12

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Environment

**Backend (.env.production)**
```bash
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/link

CLOUDINARY_CLOUD_NAME=prod_cloud_name
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret

JWT_SECRET=very_long_random_production_secret
BCRYPT_ROUNDS=12

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

**Frontend (.env.production.local)**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Deployment Options

### 1. Traditional VPS/Server Deployment

#### Backend Deployment

**Using PM2 for Process Management:**

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
cd api
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'link-api',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    }
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Deployment

```bash
# Build the application
cd ui
npm run build

# Export static files
npm run export  # If using static export

# Serve with nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/link-ui/out;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 2. Docker Deployment

#### Backend Dockerfile

```dockerfile
# api/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# ui/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./

# Install production dependencies
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: link-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: link
    volumes:
      - mongo_data:/data/db

  api:
    build: ./api
    container_name: link-api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/link?authSource=admin
    depends_on:
      - mongodb
    volumes:
      - ./api/.env:/app/.env

  ui:
    build: ./ui
    container_name: link-ui
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api

  nginx:
    image: nginx:alpine
    container_name: link-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
      - ui

volumes:
  mongo_data:
```

### 3. Cloud Platform Deployment

#### Vercel (Frontend)

**vercel.json:**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-url.com"
  },
  "regions": ["iad1"]
}
```

**Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ui
vercel --prod
```

#### Heroku (Backend)

**Procfile:**
```
web: npm start
```

**Deployment:**
```bash
# Install Heroku CLI
cd api

# Create Heroku app
heroku create link-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set CLOUDINARY_CLOUD_NAME=...

# Deploy
git push heroku main
```

#### Railway

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 10,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### DigitalOcean App Platform

**app.yaml:**
```yaml
name: link-app
services:
- name: api
  source_dir: /api
  github:
    repo: your-username/link
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${DATABASE_URL}
  - key: CLOUDINARY_CLOUD_NAME
    value: ${CLOUDINARY_CLOUD_NAME}

- name: ui
  source_dir: /ui
  github:
    repo: your-username/link
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NEXT_PUBLIC_API_URL
    value: ${api.DEPLOYED_URL}

databases:
- name: link-db
  engine: MONGODB
  version: "5"
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Sign up at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose appropriate region and tier

2. **Security Setup:**
   ```bash
   # Create database user
   Username: link-user
   Password: generate secure password
   
   # Network Access
   Add IP addresses: 0.0.0.0/0 (for development)
   # For production, restrict to specific IPs
   ```

3. **Connection String:**
   ```
   mongodb+srv://link-user:<password>@cluster.mongodb.net/link?retryWrites=true&w=majority
   ```

### Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Ubuntu

# Create database and user
mongo
use link
db.createUser({
  user: "link-user",
  pwd: "secure-password",
  roles: ["readWrite"]
})
```

## SSL/TLS Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring and Logging

### Application Monitoring

**Health Check Endpoint:**
```typescript
// api/src/routes/health.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})
```

**Performance Monitoring:**
```bash
# Install monitoring tools
npm install --save express-prom-bundle prom-client

# Basic metrics
const promBundle = require('express-prom-bundle')
app.use(promBundle({ includeMethod: true }))
```

### Logging

**Winston Logger:**
```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'link-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

## Backup and Recovery

### Database Backup

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="link"

# Create backup
mongodump --host localhost:27017 --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/link_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed files
rm -rf $BACKUP_DIR/$DATE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Automated Backup

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Security Considerations

### Environment Security

1. **Environment Variables:**
   - Never commit .env files
   - Use secure environment variable management
   - Rotate secrets regularly

2. **Database Security:**
   - Use strong passwords
   - Enable authentication
   - Restrict network access
   - Regular security updates

3. **Application Security:**
   - Input validation
   - Rate limiting
   - CORS configuration
   - Security headers

### Security Headers

```typescript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

## Performance Optimization

### Backend Optimization

1. **Compression:**
   ```typescript
   app.use(compression())
   ```

2. **Caching:**
   ```typescript
   app.use('/api', cache('5 minutes'))
   ```

3. **Database Indexing:**
   ```javascript
   // Ensure proper indexes
   db.people.createIndex({ "firstName": "text", "lastName": "text" })
   db.entities.createIndex({ "name": "text" })
   ```

### Frontend Optimization

1. **Static Export:**
   ```bash
   npm run build
   npm run export
   ```

2. **CDN Integration:**
   ```typescript
   // next.config.js
   module.exports = {
     assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
   }
   ```

3. **Image Optimization:**
   ```typescript
   // next.config.js
   module.exports = {
     images: {
       domains: ['res.cloudinary.com'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   ```typescript
   // Ensure proper CORS configuration
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://yourdomain.com'] 
       : ['http://localhost:3000'],
     credentials: true
   }))
   ```

2. **Database Connection:**
   ```bash
   # Check MongoDB connection
   mongo "mongodb+srv://cluster.mongodb.net/test" --username username
   ```

3. **Environment Variables:**
   ```bash
   # Verify environment variables are loaded
   node -e "console.log(process.env.NODE_ENV)"
   ```

### Log Analysis

```bash
# View application logs
pm2 logs link-api

# View system logs
sudo journalctl -u nginx -f

# Database logs
sudo tail -f /var/log/mongodb/mongod.log
```

This deployment guide provides comprehensive instructions for deploying the Link application in various environments, from development to production, with security and performance considerations.
