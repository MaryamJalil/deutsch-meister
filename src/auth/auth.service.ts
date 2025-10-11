import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user';
import { User } from '../models';
import { APP_CONSTANTS } from '../shared';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hashed = await bcrypt.hash(password, APP_CONSTANTS.BCRYPT_ROUNDS);
    const user = await this.userService.create({
      email,
      password: hashed,
      name,
    });
    // Return the created user. GraphQL model doesn't expose password, so it's safe.
    return user;
  }

  // async login(
  //   email: string,
  //   password: string,
  // ): Promise<{ access_token: string }> {
  //   const user = await this.userService.findByEmailWithPassword(email);
  //   if (!user) throw new UnauthorizedException('Invalid email');
  //   const valid = await bcrypt.compare(password, user.password ?? '');
  //   if (!valid) throw new UnauthorizedException('Invalid password');
  //   const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
  //   return { access_token: token };
  // }

  // src/auth/auth.service.ts
async login(email: string, password: string): Promise<{ access_token: string }> {
  const user = await this.userService.findByEmailWithPassword(email);
  if (!user || !user.password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user.id, email: user.email };
  const token = await this.jwt.signAsync(payload);
  return { access_token: token };
}


  verifyToken(token: string): unknown {
    return this.jwt.verify(token, { secret: process.env.JWT_SECRET });
  }
}
