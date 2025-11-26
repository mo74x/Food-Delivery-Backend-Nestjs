# Environment Variables Quick Reference

This document provides a quick reference for all environment variables used in the Food Delivery Backend application.

## 📋 Quick Start

Copy `.env.example` to `.env` for development:

```bash
# Development
cp .env.example .env

# Production
cp .env.production.example .env.production
```

## 🔧 All Environment Variables

### Application Settings

| Variable   | Type   | Default       | Description                                                   |
| ---------- | ------ | ------------- | ------------------------------------------------------------- |
| `NODE_ENV` | string | `development` | Application environment (`development`, `production`, `test`) |
| `PORT`     | number | `3000`        | Port the application listens on                               |

### Database Configuration

| Variable         | Type    | Default            | Description                                                    |
| ---------------- | ------- | ------------------ | -------------------------------------------------------------- |
| `DB_TYPE`        | string  | `postgres`         | Database type (currently only postgres supported)              |
| `DB_HOST`        | string  | `localhost`        | Database server hostname                                       |
| `DB_PORT`        | number  | `5433`             | Database server port                                           |
| `DB_USERNAME`    | string  | `admin`            | Database username                                              |
| `DB_PASSWORD`    | string  | `complex_password` | Database password ⚠️ **Change in production!**                 |
| `DB_DATABASE`    | string  | `food_delivery`    | Database name                                                  |
| `DB_SYNCHRONIZE` | boolean | `true`             | Auto-sync database schema ⚠️ **Set to `false` in production!** |

### Redis Configuration

| Variable     | Type   | Default     | Description           |
| ------------ | ------ | ----------- | --------------------- |
| `REDIS_HOST` | string | `localhost` | Redis server hostname |
| `REDIS_PORT` | number | `6379`      | Redis server port     |

### JWT Authentication

| Variable         | Type   | Default                                 | Description                                             |
| ---------------- | ------ | --------------------------------------- | ------------------------------------------------------- |
| `JWT_SECRET`     | string | `your-super-secret-jwt-key-change-this` | Secret key for JWT signing ⚠️ **Change in production!** |
| `JWT_EXPIRATION` | string | `1h`                                    | JWT token expiration time (e.g., `1h`, `2d`, `30m`)     |

### CORS Settings

| Variable       | Type   | Default                                       | Description                             |
| -------------- | ------ | --------------------------------------------- | --------------------------------------- |
| `CORS_ORIGINS` | string | `http://localhost:3000,http://localhost:3001` | Comma-separated list of allowed origins |

### API Configuration

| Variable          | Type    | Default | Description                                                               |
| ----------------- | ------- | ------- | ------------------------------------------------------------------------- |
| `API_PREFIX`      | string  | `api`   | API route prefix (future use)                                             |
| `SWAGGER_ENABLED` | boolean | `true`  | Enable/disable Swagger documentation ⚠️ **Set to `false` in production!** |

## 🔒 Security Best Practices

### Must Change in Production

- ⚠️ `JWT_SECRET` - Use a strong, random string (minimum 32 characters)
  - Generate: `openssl rand -base64 64`
- ⚠️ `DB_PASSWORD` - Use a strong, unique password
- ⚠️ `DB_SYNCHRONIZE` - **Must be `false`** in production
- ⚠️ `SWAGGER_ENABLED` - **Must be `false`** in production for security

### Production Checklist

- [ ] All secrets changed from default values
- [ ] `DB_SYNCHRONIZE` set to `false`
- [ ] `SWAGGER_ENABLED` set to `false`
- [ ] `NODE_ENV` set to `production`
- [ ] `CORS_ORIGINS` configured with actual production domains
- [ ] Strong `DB_PASSWORD` configured
- [ ] Strong `JWT_SECRET` generated and configured

## 📝 Examples

### Development `.env`

```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_SYNCHRONIZE=true
SWAGGER_ENABLED=true
JWT_SECRET=dev-secret-key-for-testing-only
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production `.env.production`

```bash
NODE_ENV=production
PORT=3000
DB_HOST=production-db.example.com
DB_PORT=5432
DB_SYNCHRONIZE=false
SWAGGER_ENABLED=false
JWT_SECRET=<very-long-random-string-from-openssl>
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Staging `.env.staging`

```bash
NODE_ENV=staging
PORT=3000
DB_HOST=staging-db.example.com
DB_PORT=5432
DB_SYNCHRONIZE=false
SWAGGER_ENABLED=true
JWT_SECRET=<different-random-string-for-staging>
CORS_ORIGINS=https://staging.yourdomain.com
```

## 🐳 Docker Environment Variables

When using Docker, you can:

1. **Use environment file:**

   ```bash
   docker run --env-file .env.production food-delivery-api
   ```

2. **Pass individual variables:**

   ```bash
   docker run -e NODE_ENV=production -e PORT=3000 food-delivery-api
   ```

3. **Use docker-compose:**
   ```yaml
   services:
     api:
       env_file:
         - .env.production
   ```

## 🌐 Cloud Platform Environment Variables

### Heroku

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here
heroku config:set DB_SYNCHRONIZE=false
```

### AWS/DigitalOcean

Set environment variables through the platform's dashboard or CLI.

### Azure

```bash
az webapp config appsettings set --name your-app --settings NODE_ENV=production
```

## 🔍 Accessing Environment Variables in Code

```typescript
import { ConfigService } from '@nestjs/config';

// In a service/controller
constructor(private configService: ConfigService) {}

// Get a value
const port = this.configService.get<number>('port');
const dbHost = this.configService.get<string>('database.host');
const jwtSecret = this.configService.get<string>('jwt.secret');
```

## 📚 Related Files

- `.env.example` - Development environment template
- `.env.production.example` - Production environment template
- `src/config/configuration.ts` - Configuration loader
- `PRODUCTION.md` - Full production deployment guide

---

For more details on production deployment, see [PRODUCTION.md](./PRODUCTION.md)
