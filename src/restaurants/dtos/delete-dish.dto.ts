import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class DeleteDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class DeleteDishOutput extends MutationOutput {}