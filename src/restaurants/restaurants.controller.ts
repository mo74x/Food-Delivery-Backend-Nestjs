import { Controller, Post, Body, UseGuards,Get} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { RestaurantsService } from './restaurants.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}
  @Post()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN)
  createRestaurant(@Body() body: any, @GetUser() user: User) {
    return this.restaurantsService.createRestaurant(body, user);
  }

  @Get()
  getAllRestaurants() {
    return this.restaurantsService.getAllRestaurants();
  }
}
