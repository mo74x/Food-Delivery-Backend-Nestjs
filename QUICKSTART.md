# 🚀 Quick Start Guide

Get the Food Delivery Backend up and running in minutes!

## 📋 Prerequisites

Make sure you have installed:

- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- ✅ Git ([Download](https://git-scm.com/))

## ⚡ 5-Minute Setup

### Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <repository-url>
cd Food-Delivery-Backend-Nestjs

# Install dependencies
npm install
```

### Step 2: Start Database & Redis (1 min)

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Verify containers are running
docker ps
```

### Step 3: Environment Setup (1 min)

The `.env` file is already created with development defaults. You're ready to go!

**Optional:** Review/modify `.env` if needed:

```bash
# Open .env file to review settings
notepad .env    # Windows
nano .env       # Linux/Mac
```

### Step 4: Run the Application (1 min)

```bash
# Start in development mode
npm run start:dev
```

## ✨ You're Done!

Your application is now running:

🌐 **API Server**: http://localhost:3000
📚 **Swagger Docs**: http://localhost:3000/api

## 🧪 Test the API

### 1. Create an Account

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123456"}'
```

### 2. Sign In

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123456"}'
```

### 3. Use Swagger UI (Easiest!)

Open http://localhost:3000/api in your browser and test all endpoints interactively!

## 🛠️ Development Commands

```bash
# Development (with hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication (JWT, Guards)
├── users/          # User entity
├── restaurants/    # Restaurant CRUD
├── products/       # Product CRUD
├── orders/         # Order management
├── config/         # Configuration loader
├── app.module.ts   # Root module
└── main.ts         # Entry point
```

## 🔑 Default Credentials

**Database (PostgreSQL):**

- Host: `localhost:5433`
- User: `admin`
- Password: `complex_password`
- Database: `food_delivery`

**Redis:**

- Host: `localhost:6379`

## 🎯 Common Tasks

### Adding a New Module

```bash
nest generate module <module-name>
nest generate controller <module-name>
nest generate service <module-name>
```

### Database Changes

The app uses `synchronize: true` in development, so schema changes are automatic.
**Note**: Use migrations for production!

### API Documentation

- Add `@ApiTags()` to controllers
- Add `@ApiOperation()` to methods
- Add `@ApiProperty()` to DTOs
  See `src/products/` for examples!

## ❓ Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=4000
```

### Docker Issues

```bash
# Reset containers
docker-compose down -v
docker-compose up -d
```

### Database Connection Failed

```bash
# Check Docker containers are running
docker ps

# Check logs
docker-compose logs postgres
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📖 Next Steps

- ✅ Read [README.md](./README.md) for detailed documentation
- ✅ Review [ENV_VARS.md](./ENV_VARS.md) for configuration options
- ✅ Check [PRODUCTION.md](./PRODUCTION.md) before deploying

## 💡 Pro Tips

1. **Use Swagger** - It's the fastest way to test your API
2. **Hot Reload** - Code changes auto-reload in dev mode
3. **Check Logs** - Watch the terminal for helpful error messages
4. **Database GUI** - Use pgAdmin or DBeaver to view data
5. **Redis GUI** - Use Redis Commander to monitor cache

## 🆘 Getting Help

- Review error messages carefully
- Check environment variables in `.env`
- Verify Docker containers are running
- Read the detailed guides in the docs folder

---

**Happy Coding! 🎉**
