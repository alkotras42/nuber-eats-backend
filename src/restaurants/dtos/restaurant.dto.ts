import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurants.entity';


@InputType()
export class RestaurantInput {
    @Field(type => Number)
    restaurantId: number
}

@ObjectType()
export class RestaurantOutput extends MutationOutput {
    @Field(type => Restaurant, {nullable: true})
    restaurant?: Restaurant
}