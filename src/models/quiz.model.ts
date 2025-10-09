import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Quiz {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  question: string;

  @Field(() => [String])
  options: string[];

  @Field(() => String)
  answer: string;

  @Field(() => String)
  level: string;

  @Field(() => Int, { nullable: true })
  lessonId?: number | null;

  @Field(() => Date)
  createdAt: Date;
}
