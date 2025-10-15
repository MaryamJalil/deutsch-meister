// models/audio.model.ts
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Audio {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  s3Key: string;

  @Field(() => String)
  s3Bucket: string;

  @Field(() => String)
  s3Url: string;

  @Field(() => Float)
  duration: number;

  @Field(() => Int)
  fileSize: number;

  @Field(() => String)
  format: string;

  @Field(() => Boolean)
  isPublic: boolean;

  @Field(() => String)
  category: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => String, { nullable: true })
  lessonId?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}