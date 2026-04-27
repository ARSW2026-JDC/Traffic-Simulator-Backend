import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Estatus } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cacheKey = 'users:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    await this.redis.set(cacheKey, JSON.stringify(users), 30);
    return users;
  }

  updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAllActive() {
    const cacheKey = 'users:active';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const users = await this.prisma.user.findMany({
      where: { estatus: 'ACTIVE' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    await this.redis.set(cacheKey, JSON.stringify(users), 30);
    return users;
  }

  changeEstatus(id: string, estatus: Estatus) {
    return this.prisma.user.update({
      where: { id },
      data: { estatus },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        estatus: true,
      },
    });
  }
}
