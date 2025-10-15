import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Progress {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  xp: number; // total experience points earned by the user

  @Field(() => Int)
  streak: number; // number of consecutive active days

  @Field(() => Int)
  lessonsDone: number; // number of lessons completed

  @Field(() => Int)
  quizzesDone: number; // number of quizzes completed

  @Field(() => Date)
  lastActive: Date; // last time user was active

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Computed fields (you can add these)
  @Field(() => Int, { nullable: true })
  level?: number; // calculated level based on XP

  @Field(() => Float, { nullable: true })
  levelProgress?: number; // progress to next level (0-1)

  // Relation to User
  @Field(() => User)
  user: User;
}