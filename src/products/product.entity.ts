import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from '../orders/order-item.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('boolean', { default: true })
  is_active: boolean;

  // Inverse relation for TypeORM to understand the link
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant;
}
