export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        type: process.env.DB_TYPE || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433', 10),
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'complex_password',
        database: process.env.DB_DATABASE || 'food_delivery',
        synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
        expiresIn: process.env.JWT_EXPIRATION || '1h',
    },
    cors: {
        origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true' || true,
    },
});
