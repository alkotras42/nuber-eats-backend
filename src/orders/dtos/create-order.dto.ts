import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { OrderItemOption } from '../entities/order-item.dto';

@InputType()
class CreateOrdersItemInput {
  @Field((type) => Number)
  dishId: number;

  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
  @Field((type) => [CreateOrdersItemInput])
  items: CreateOrdersItemInput[];

  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class CreateOrderOutput extends MutationOutput {}
