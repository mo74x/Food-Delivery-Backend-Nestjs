import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderProcessor } from './order.processor';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Restaurant]),
    BullModule.registerQueue({
      name: 'notifications-queue',
    })
  ],
  controllers: [OrdersController],
  providers: [OrdersService,OrderProcessor,OrdersGateway]
})
export class OrdersModule { }
