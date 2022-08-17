import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Restaurant } from './restaurants.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field((type) => String)
  name: string;

  @Field((type) => Number, { nullable: true })
  extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field((type) => String)
  name: string;

  @Field((type) => Number, { nullable: true })
  extra?: number;

  @Field((type) => [DishChoice], { nullable: true })
  choices?: DishChoice[];
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field((is) => String)
  @Length(5, 20)
  @IsString()
  @Column({ unique: true })
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field((type) => Number)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5, 220)
  description: string;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
