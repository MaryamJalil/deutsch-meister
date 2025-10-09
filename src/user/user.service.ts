import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { User } from '../models';

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

  // For auth: include password to verify credentials
  findByEmailWithPassword(
    email: string,
  ): Promise<(User & { password: string | null }) | null> {
    if (typeof email !== 'string' || email.trim().length === 0) {
      throw new Error('Invalid email value provided');
    }
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    }) as unknown as Promise<(User & { password: string | null }) | null>;
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
