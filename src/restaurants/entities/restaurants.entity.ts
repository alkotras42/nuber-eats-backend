import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((is) => ID)
  id: number;

  @Field((is) => String)
  @Length(5, 10)
  @IsString()
  @Column()
  name: string;

  @Field((is) => Boolean, {defaultValue: true})
  @IsBoolean()
  @IsOptional()
  @Column({ default: true })
  isVegan?: boolean;

  @Field((is) => String)
  @IsString()
  @Column()
  address: string;

  @Field((is) => String)
  @IsString()
  @Column()
  ownerName: string;

  @Field((is) => String)
  @IsString()
  @Column()
  categoryName: string;
}
