import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}

  async createOrder(
    customer: User,
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurant.findOne(
        createOrderInput.restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurannt not found',
        };
      }
      
      const order = await this.orders.save(this.orders.create({customer, restaurant}))
      console.log(order)
      return {
        ok: true
      }
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }
}
