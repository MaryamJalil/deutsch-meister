import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    if (typeof email !== 'string' || email.trim().length === 0) {
      throw new Error('Invalid email value provided');
    }
    return this.prisma.user.findUnique({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(id: number): Promise<User | null> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.user.findUnique({ where: { id: numericId } });
  }

  delete(id: number): Promise<User> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.user.delete({ where: { id: numericId } });
  }
}
