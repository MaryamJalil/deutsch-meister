import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@ObjectType()
class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => User)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<User> {
    return this.auth.register(email, password, name);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    const { access_token } = await this.auth.login(email, password);
    const user = await this.userService.findByEmail(email);
    return { access_token, user: user ?? undefined };
  }
}
