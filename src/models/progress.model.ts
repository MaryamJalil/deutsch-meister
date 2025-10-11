import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.model'

@ObjectType()
export class Progress {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  xp: number; // total experience points earned by the user

  @Field(() => Int)
  streak: number; // number of consecutive active days

  @Field(() => Int)
  lessons: number; // number of lessons completed

  @Field()
  updatedAt: Date; // last time progress was updated


  @Field()
  lastActive: Date; // last time progress was updated

  // Relation to User
  @Field(() => User)
  user: User;
}
