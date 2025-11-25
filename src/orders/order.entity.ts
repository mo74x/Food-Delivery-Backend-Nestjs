import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Money handling
  total_amount: number;

  @Column({ default: 'pending' })
  status: string;

  // RELATION: Many Orders belong to One User
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  // RELATION: Many Orders belong to One Restaurant
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  // RELATION: One Order has Many Items
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;
}
