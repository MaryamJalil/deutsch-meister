import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Quiz } from './quiz.model';

@ObjectType()
export class Lesson {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  level: string;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => [Quiz], { nullable: true })
  quizzes?: Quiz[] | null;

  @Field(() => Date)
  createdAt: Date;
}
