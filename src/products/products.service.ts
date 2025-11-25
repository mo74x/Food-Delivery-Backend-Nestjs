import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    async createProduct(createProductDto: CreateProductDto, user: User): Promise<Product> {
        const { name, description, price, restaurantId } = createProductDto;
        console.log('Creating product...');

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
        const savedProduct = await this.productRepository.save(product);
        console.log('Product created successfully');

        // 🔥 Invalidate cache so users see the new product immediately
        const cacheKey = `menu_${restaurantId}`;
        await this.cacheManager.del(cacheKey);
        console.log(`🗑️  Cache invalidated for restaurant ${restaurantId}`);

        return savedProduct;
    }
    //To Get Menu By resturant
    async getProductsByRestaurant(restaurantId: string): Promise<Product[]> {
        const cacheKey = `menu_${restaurantId}`;
        const cachedMenu = await this.cacheManager.get<Product[]>(cacheKey);
        if (cachedMenu) {
            console.log('⚡ Fetched from REDIS (Fast)');
            return cachedMenu;
        }
        console.log('🐢 Fetched from DB (Slow)');
        const products = await this.productRepository.find({
            where: { restaurant: { id: restaurantId } },
        });
        await this.cacheManager.set(cacheKey, products, 60000);

        return products;
    }
}
