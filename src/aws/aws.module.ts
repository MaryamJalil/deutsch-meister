import { Module } from '@nestjs/common';
import { AwsResolver } from './aws.resolver';

@Module({
  providers: [AwsResolver],
  controllers: [],
})
export class AWSModule {}