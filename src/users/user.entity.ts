import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'restaurant_admin',
  DRIVER = 'driver',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @CreateDateColumn()
  created_at: Date;
}
