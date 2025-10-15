import { Test, TestingModule } from '@nestjs/testing';
import { AwsResolver } from './aws.resolver';

describe('AwsResolver', () => {
  let resolver: AwsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsResolver],
    }).compile();

    resolver = module.get<AwsResolver>(AwsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
