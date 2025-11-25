import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,
    ) { }

    async createProduct(createProductDto: CreateProductDto, user: User): Promise<Product> {
        const { name, description, price, restaurantId } = createProductDto;

        const restaurant = await this.restaurantRepository.findOne({
            where: { id: restaurantId },
            relations: ['owner']
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }
        if (restaurant.owner.id !== user.id) {
            throw new ForbiddenException('You are not the owner of this restaurant');
        }

        const product = this.productRepository.create({
            name,
            description,
            price,
            restaurant,
        });

        return this.productRepository.save(product);
    }
    //To Get Menu By resturant
    async getProductsByRestaurant(restaurantId: string): Promise<Product[]> {
        return await this.productRepository.find({
            where: { restaurant: { id: restaurantId } }
        });
    }

}
