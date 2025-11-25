import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const { name, address } = createRestaurantDto;

    const restaurant = this.restaurantRepository.create({
      name,
      address,
      owner: user, // Link the relationship here!
    });

    return await this.restaurantRepository.save(restaurant);
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find();
  }
}
