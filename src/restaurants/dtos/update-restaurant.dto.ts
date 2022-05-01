import { ArgsType, Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { createRestaurantDto } from './create-restaraunt.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(
  createRestaurantDto,
) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((is) => ID)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
