import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
//import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, Restaurant]), AuthModule],
})
export class ProductsModule {
}