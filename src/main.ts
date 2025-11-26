import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  const corsOrigins = configService.get<string[]>('cors.origins') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation (only in development)
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Food Delivery API')
      .setDescription('The backend API for the Food Delivery application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = configService.get<number>('port') || 3000;
  // Bind to 0.0.0.0 to accept external connections (required for Render, Heroku, etc.)
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  if (swaggerEnabled) {
    console.log(`Swagger documentation available at: http://localhost:${port}/api`);
  }
}
bootstrap();

