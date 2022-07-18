import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { EditRestaurantInput } from './edit-restaurant.dto';

@InputType()
export class DeleteRestaurantInput {
    @Field(type => Number)
    restaurantId: number
}

@ObjectType()
export class DeleteRestaurantOutput extends MutationOutput {}