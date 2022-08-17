import {
  Field,
  Float,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { OrderItem } from './order-item.dto';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatis' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer?: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  driver?: User;

  @Field((type) => Restaurant, {nullable: true})
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  restaurant?: Restaurant;

  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem)
  @JoinTable()
  items: OrderItem[];

  @Column({ nullable: true })
  @Field((type) => Float, { nullable: true })
  @IsNumber()
  total?: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  @Field((type) => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
