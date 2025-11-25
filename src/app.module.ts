import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Product } from './products/product.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: 'complex_password',
      database: 'food_delivery',
      entities: [User, Order, OrderItem, Product, Restaurant],
      synchronize: true,
    }),
    AuthModule,
    RestaurantsModule,
  ],
  providers: [],
})
export class AppModule {}
