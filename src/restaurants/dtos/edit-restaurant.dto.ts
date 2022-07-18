import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { createRestaurantInput } from './create-restaraunt.dto';

@InputType()
export class EditRestaurantInput extends PartialType(createRestaurantInput) {

    @Field(type => Number)
    restaurantId: number

}


@ObjectType()
export class EditRestaurantOutput extends MutationOutput {}
