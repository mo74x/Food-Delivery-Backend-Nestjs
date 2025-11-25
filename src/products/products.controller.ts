import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';


@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(UserRole.ADMIN)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @GetUser() user: User) {
        return this.productsService.createProduct(createProductDto, user);
    }
    @Get('/:restaurantId')
    async getMenu(@Param('restaurantId') restaurantId: string) {
        return this.productsService.getProductsByRestaurant(restaurantId);
    }
}