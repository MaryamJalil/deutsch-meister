import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../models';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  helloUser(): string {
    return 'User module connected!';
  }

  @Mutation(() => String)
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<string> {
    await this.userService.delete(id);
    return 'Deleted!';
  }
}
