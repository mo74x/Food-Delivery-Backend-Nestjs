import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@Controller('products')
@ApiTags('Products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    //using updates
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @GetUser() user: User) {
        return this.productsService.createProduct(createProductDto, user);
    }
    @Get('/:restaurantId')
    async getMenu(@Param('restaurantId') restaurantId: string) {
        return this.productsService.getProductsByRestaurant(restaurantId);
    }
    @Get('/search')
    search(@Query('text') text: string) {
        if (!text) return [];
        return this.productsService.searchProducts(text);
    }
}