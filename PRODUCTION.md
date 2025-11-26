# Production Deployment Guide

This guide will help you deploy the Food Delivery Backend to production.

## 1. Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database Configuration
DB_TYPE=postgres
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-db-password
DB_DATABASE=food_delivery
DB_SYNCHRONIZE=false  # IMPORTANT: Set to false in production

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-very-secure-and-long-random-secret-key-here
JWT_EXPIRATION=1h

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# API Configuration
API_PREFIX=api
SWAGGER_ENABLED=false  # Set to false in production for security
```

## 2. Database Migrations

**IMPORTANT:** In production, always use migrations instead of `synchronize: true`.

### Create a migration:

```bash
npm run typeorm migration:generate -- -n CreateTables
```

### Run migrations:

```bash
npm run typeorm migration:run
```

### Revert migration:

```bash
npm run typeorm migration:revert
```

## 3. Build the Application

```bash
# Install dependencies
npm ci --production=false

# Build the application
npm run build
```

## 4. Security Checklist

- [ ] Set `DB_SYNCHRONIZE=false` in production
- [ ] Set `SWAGGER_ENABLED=false` in production
- [ ] Use strong, random `JWT_SECRET` (minimum 32 characters)
- [ ] Configure CORS with your actual domain(s)
- [ ] Use HTTPS/SSL in production
- [ ] Set secure database passwords
- [ ] Enable rate limiting
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Use environment-specific .env files
- [ ] Never commit .env files to version control

## 5. Recommended Production Setup

### 5.1 Install Additional Security Packages

```bash
npm install helmet
npm install @nestjs/throttler
```

### 5.2 Add Rate Limiting (Recommended)

Add to `app.module.ts`:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

imports: [
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  }),
  // ... other imports
];
```

### 5.3 Add Helmet for Security Headers

Add to `main.ts`:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

## 6. Docker Deployment

### 6.1 Create `.dockerignore`:

```
node_modules
npm-debug.log
dist
.env
.env.*
.git
.gitignore
README.md
```

### 6.2 Create Production `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### 6.3 Build and Run:

```bash
docker build -t food-delivery-api .
docker run -p 3000:3000 --env-file .env.production food-delivery-api
```

## 7. Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 8. Cloud Platforms

### AWS Deployment

1. **Elastic Beanstalk**: Easy deployment with managed infrastructure
2. **ECS/Fargate**: Container-based deployment
3. **RDS**: Managed PostgreSQL database
4. **ElastiCache**: Managed Redis cache

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure environment variables in the dashboard
3. Add PostgreSQL and Redis as managed databases
4. Deploy automatically on push

## 9. Monitoring and Logging

### 9.1 Logging

Install Winston:

```bash
npm install nest-winston winston
```

### 9.2 Health Checks

Install Terminus:

```bash
npm install @nestjs/terminus
```

Add health check endpoint for container orchestration.

### 9.3 Application Performance Monitoring

Consider:

- **New Relic**
- **DataDog**
- **Sentry** (for error tracking)
- **Prometheus + Grafana**

## 10. CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy
        # Add your deployment commands here
```

## 11. Performance Optimization

- Enable Node.js clustering for multi-core CPU usage
- Use Redis for caching frequently accessed data
- Optimize database queries with proper indexes
- Use connection pooling
- Enable gzip compression
- Implement query result caching

## 12. Backup Strategy

- **Database**: Set up automated backups for PostgreSQL
- **Redis**: Configure Redis persistence (RDB/AOF)
- **Application State**: Store uploaded files in S3 or similar
- **Regular Testing**: Test backup restoration regularly

## 13. SSL/TLS Configuration

- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (Nginx, Caddy) for SSL termination
- Force HTTPS redirects
- Use HSTS headers

## 14. Maintenance

- Keep dependencies up to date
- Monitor security advisories
- Regular security audits
- Performance monitoring
- Log analysis
- Database optimization

## 15. Rollback Plan

- Tag releases in Git
- Keep previous Docker images
- Have a documented rollback procedure
- Test rollback process regularly

---

**Remember**: Always test in a staging environment before deploying to production!
