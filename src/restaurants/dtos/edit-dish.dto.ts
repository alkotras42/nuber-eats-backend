import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'price',
  'options',
  'description',
]) {
  @Field((type) => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends MutationOutput {}
