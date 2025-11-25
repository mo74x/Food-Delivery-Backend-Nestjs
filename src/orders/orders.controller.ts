import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';


@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
        return this.ordersService.createOrder(createOrderDto, user);
    }
}
