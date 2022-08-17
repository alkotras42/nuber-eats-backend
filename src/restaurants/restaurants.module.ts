import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurants.entity';
import { CategoryRepository } from './repositories/categoty.repository';
import { CategoryResolver, DishResolver, RestaurantsResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
    providers: [RestaurantsResolver, RestaurantService, CategoryResolver, DishResolver],
})
export class RestaurantsModule {}
