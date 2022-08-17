import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish, DishChoice } from 'src/restaurants/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';


@InputType('OrderItemOptionsInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;

  @Field((type) => Number, { nullable: true })
  extra?: number;

  @Field((type) => DishChoice, { nullable: true })
  choice?: DishChoice;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {


  @ManyToOne((type) => Dish, {nullable: true, onDelete: 'CASCADE'})
  dish?: Dish;

  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
