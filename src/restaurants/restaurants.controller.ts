import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantsController {
      @Post()
      @Roles(UserRole.ADMIN)
      createRestaurant(@Body() body: any) {
      return { message: 'Restaurant created successfully', data: body };
  }
}