import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  // The Link: Many Restaurants can be owned by One User
  @ManyToOne(() => User, (user) => user.restaurants, { eager: false })
  owner: User;

  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];
}