import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

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
  ): Promise<Pick<User, 'id' | 'email' | 'name'>> {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashed,
      name,
    });
    return { id: user.id, email: user.email, name: user.name };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email');
    const valid = await bcrypt.compare(password, user.password ?? '');
    if (!valid) throw new UnauthorizedException('Invalid password');
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { access_token: token };
  }

  verifyToken(token: string): unknown {
    return this.jwt.verify(token, { secret: process.env.JWT_SECRET });
  }
}
