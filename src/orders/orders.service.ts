import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/user.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectQueue('notifications-queue') private notificationQueue: Queue) { }

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { restaurantId, items } = createOrderDto;

    // 1. Initialize the Transaction Manager
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ----------------- TRANSACTION STARTS HERE -----------------

      // A. Verify Restaurant exists
      const restaurant = await queryRunner.manager.findOne(Restaurant, {
        where: { id: restaurantId }
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');

      // B. Create the Order Entry (Initial status: Pending)
      const order = new Order();
      order.user = user;
      order.restaurant = restaurant;
      order.status = 'pending';
      order.total_amount = 0; // We calculate this below

      // Save order first to generate an ID
      const savedOrder = await queryRunner.manager.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // C. Process each item (Check price, calculate total, create OrderItem)
      for (const itemDto of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId, restaurant: { id: restaurantId } }
        });

        if (!product) {
          throw new NotFoundException(`Product ${itemDto.productId} not found in this restaurant`);
        }

        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product = product;
        orderItem.quantity = itemDto.quantity;
        orderItem.price = product.price; // <--- PRICE SNAPSHOT (Crucial!)

        totalAmount += product.price * itemDto.quantity;
        orderItems.push(orderItem);
      }

      // D. Save all items
      await queryRunner.manager.save(OrderItem, orderItems);

      // E. Update the total amount on the order
      savedOrder.total_amount = totalAmount;
      await queryRunner.manager.save(Order, savedOrder);

      // ----------------- COMMIT TRANSACTION -----------------
      await queryRunner.commitTransaction();
      // ----------------- SEND EMAIL -----------------
      await this.notificationQueue.add('send_confirmation_email',
        {
          email: user.email,
          orderId: savedOrder.id,
          amount: savedOrder.total_amount
        });
      console.log('🚀 Job added to queue!');
      return savedOrder;

    } catch (err) {
      // ----------------- ROLLBACK -----------------
      // If anything failed above, undo changes to the database
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Always release the connection back to the pool
      await queryRunner.release();
    }
  }
}