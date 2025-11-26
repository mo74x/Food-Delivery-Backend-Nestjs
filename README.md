# 🍔 Food Delivery Backend - NestJS

A robust and scalable food delivery backend API built with NestJS, TypeScript, PostgreSQL, Redis, and BullMQ. This application provides a complete backend solution for managing restaurants, products, orders, and user authentication with real-time order tracking capabilities.

## ✨ Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, User)
  - Secure password hashing with bcrypt
- **🏪 Restaurant Management**
  - Create and manage restaurants (Admin only)
  - Browse all available restaurants
  - Restaurant-specific product listings

- **🍕 Product Management**
  - Create products for restaurants (Admin only)
  - Search products by text
  - Get restaurant menu (all products for a specific restaurant)
  - Redis caching for improved performance

- **🛒 Order Management**
  - Place orders with multiple items
  - Real-time order status updates via WebSockets
  - Background order processing with BullMQ
  - Order history tracking

- **⚡ Performance & Scalability**
  - Redis caching layer
  - Job queue with BullMQ for async processing
  - WebSocket support for real-time updates
  - Database connection pooling

## 🛠️ Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL 15
- **ORM:** TypeORM 0.3
- **Cache:** Redis with cache-manager
- **Queue:** BullMQ
- **Authentication:** JWT with Passport
- **Real-time:** Socket.IO
- **Validation:** class-validator & class-transformer
- **Testing:** Jest
- **Container:** Docker & Docker Compose

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for running PostgreSQL and Redis)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Food-Delivery-Backend-Nestjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Docker containers

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on port `5433`
- Redis on port `6379`

### 4. Environment Configuration

The application now uses environment variables for configuration. A `.env` file has been created with default development values.

**Configuration File:** `.env`

```bash
# Application
NODE_ENV=development
PORT=3000

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=admin
DB_PASSWORD=complex_password
DB_DATABASE=food_delivery
DB_SYNCHRONIZE=true

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API Configuration
API_PREFIX=api
SWAGGER_ENABLED=true
```

**Important Notes:**

- The `.env` file is already created with default values
- Never commit `.env` to version control (it's in `.gitignore`)
- For production, see `PRODUCTION.md` for deployment guidelines
- Change `JWT_SECRET` to a strong random value in production
- Set `DB_SYNCHRONIZE=false` in production and use migrations

### 5. Run the application

**Development mode:**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

**Debug mode:**

```bash
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📖 Swagger API Documentation

This project includes interactive Swagger/OpenAPI documentation. When the application is running in development mode, you can access it at:

**Swagger UI:** `http://localhost:3000/api`

The Swagger interface allows you to:

- View all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- View authentication requirements
- See example payloads

> **Note:** Swagger is enabled by default in development but disabled in production for security. You can control this with the `SWAGGER_ENABLED` environment variable.

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint       | Description             | Auth Required |
| ------ | -------------- | ----------------------- | ------------- |
| POST   | `/auth/signup` | Register a new user     | No            |
| POST   | `/auth/signin` | Login and get JWT token | No            |

**Signup/Signin Request Body:**

```json
{
  "username": "user123",
  "password": "password123"
}
```

**Signin Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Restaurant Endpoints

| Method | Endpoint       | Description             | Auth Required | Role  |
| ------ | -------------- | ----------------------- | ------------- | ----- |
| GET    | `/restaurants` | Get all restaurants     | No            | -     |
| POST   | `/restaurants` | Create a new restaurant | Yes           | ADMIN |

**Create Restaurant Request:**

```json
{
  "name": "Pizza Palace",
  "address": "123 Main St",
  "description": "Best pizza in town"
}
```

### Product Endpoints

| Method | Endpoint                      | Description                       | Auth Required | Role  |
| ------ | ----------------------------- | --------------------------------- | ------------- | ----- |
| POST   | `/products`                   | Create a new product              | Yes           | ADMIN |
| GET    | `/products/:restaurantId`     | Get all products for a restaurant | No            | -     |
| GET    | `/products/search?text=pizza` | Search products by text           | No            | -     |

**Create Product Request:**

```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 12.99,
  "restaurantId": "uuid-here"
}
```

### Order Endpoints

| Method | Endpoint  | Description        | Auth Required |
| ------ | --------- | ------------------ | ------------- |
| POST   | `/orders` | Create a new order | Yes           |

**Create Order Request:**

```json
{
  "restaurantId": "uuid-here",
  "items": [
    {
      "productId": "uuid-here",
      "quantity": 2
    },
    {
      "productId": "uuid-here",
      "quantity": 1
    }
  ]
}
```

### Authentication

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Data Transfer Objects
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── jwt.strategy.ts      # JWT strategy
│   ├── roles.decorator.ts   # Role decorator
│   ├── roles.guard.ts       # Role guard
│   └── get-user.decorator.ts # User decorator
├── users/                   # Users module
│   └── user.entity.ts       # User entity
├── restaurants/             # Restaurants module
│   ├── dto/
│   ├── restaurant.entity.ts
│   ├── restaurants.controller.ts
│   ├── restaurants.service.ts
│   └── restaurants.module.ts
├── products/                # Products module
│   ├── dto/
│   ├── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/                  # Orders module
│   ├── dto/
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.gateway.ts    # WebSocket gateway
│   ├── order.processor.ts   # BullMQ processor
│   └── orders.module.ts
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## 🗄️ Database Schema

### Users

- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: ADMIN, USER)
- `createdAt` (Timestamp)

### Restaurants

- `id` (UUID, Primary Key)
- `name` (String)
- `address` (String)
- `description` (String)
- `owner` (User relation)
- `products` (One-to-Many with Products)
- `createdAt` (Timestamp)

### Products

- `id` (UUID, Primary Key)
- `name` (String)
- `description` (String)
- `price` (Decimal)
- `restaurant` (Many-to-One with Restaurant)
- `createdAt` (Timestamp)

### Orders

- `id` (UUID, Primary Key)
- `user` (Many-to-One with User)
- `restaurant` (Many-to-One with Restaurant)
- `totalPrice` (Decimal)
- `status` (Enum: PENDING, CONFIRMED, PREPARING, DELIVERING, DELIVERED, CANCELLED)
- `items` (One-to-Many with OrderItems)
- `createdAt` (Timestamp)

### OrderItems

- `id` (UUID, Primary Key)
- `order` (Many-to-One with Order)
- `product` (Many-to-One with Product)
- `quantity` (Number)
- `price` (Decimal)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔧 Available Scripts

| Script                | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run build`       | Build the application                     |
| `npm run start`       | Start the application                     |
| `npm run start:dev`   | Start in development mode with hot-reload |
| `npm run start:debug` | Start in debug mode                       |
| `npm run start:prod`  | Start in production mode                  |
| `npm run format`      | Format code with Prettier                 |
| `npm run lint`        | Lint and fix code with ESLint             |
| `npm test`            | Run unit tests                            |
| `npm run test:e2e`    | Run end-to-end tests                      |
| `npm run test:cov`    | Run tests with coverage                   |

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

# Remove volumes (careful: this deletes data)
docker-compose down -v
```

## 🔄 Real-time Features

The application uses WebSockets for real-time order updates. Clients can connect to the WebSocket server and listen for order status changes:

```javascript
// Example client code
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('orderStatusUpdate', (data) => {
  console.log('Order status updated:', data);
});
```

## 📦 Background Jobs

The application uses BullMQ for processing orders asynchronously. When an order is created, it's added to a queue and processed in the background. This ensures:

- Better performance
- Scalability
- Resilience to failures
- Ability to retry failed jobs

## 🔒 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Stateless authentication with configurable expiration
- **Role-Based Access Control:** Protect admin-only endpoints
- **Input Validation:** All DTOs are validated using class-validator
- **SQL Injection Protection:** TypeORM parameterized queries

## 🚀 Production Considerations

✅ **Completed:**

1. ✅ **Environment Variables:** All configuration now uses environment variables (`.env`)
2. ✅ **Swagger Documentation:** Swagger/OpenAPI documentation is implemented
3. ✅ **Validation:** Global validation pipes are configured
4. ✅ **CORS:** CORS is configured with environment-based origins

📋 **Before deploying to production:**

1. **Review `PRODUCTION.md`**: Comprehensive deployment guide included
2. **Database Migrations:** Use TypeORM migrations instead of `synchronize: true`
3. **Security Enhancements:** Add helmet and rate limiting (see `PRODUCTION.md`)
4. **Logging:** Implement proper logging (Winston, Pino)
5. **Monitoring:** Add health checks and APM (Prometheus, DataDog, New Relic)
6. **SSL/TLS:** Enable HTTPS in production
7. **Secrets Management:** Use secure secrets management
8. **Disable Swagger:** Set `SWAGGER_ENABLED=false` in production

📖 **See [PRODUCTION.md](./PRODUCTION.md) for detailed deployment instructions and best practices.**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 👥 Authors

- Mohamed-Arafa(Mo74x)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM for robust ORM capabilities
- The open-source community

---

**Happy Coding! 🚀**
