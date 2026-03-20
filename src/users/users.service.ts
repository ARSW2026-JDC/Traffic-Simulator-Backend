import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Estatus } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  findAllActive() {
    return this.prisma.user.findMany({
      where: { estatus: 'ACTIVE' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  changeEstatus(id: string, estatus: Estatus) {
    return this.prisma.user.update({
      where: { id },
      data: {   estatus },
      select: { id: true, email: true, name: true, role: true, createdAt: true, estatus: true },
    });
  }
}
