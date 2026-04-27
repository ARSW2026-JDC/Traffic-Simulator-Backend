import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Role, Estatus } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: any;
  let redisMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'USER' as Role,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'user-2',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'ADMIN' as Role,
        createdAt: new Date('2024-01-02'),
      },
    ];

    it('should return cached users if available', async () => {
      const mockUsersJson = JSON.stringify(mockUsers);
      redisMock.get.mockResolvedValue(mockUsersJson);

      const result = await service.findAll();

      expect(redisMock.get).toHaveBeenCalledWith('users:all');
      expect(prismaMock.user.findMany).not.toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should fetch from database when cache is empty', async () => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(redisMock.set).toHaveBeenCalledWith(
        'users:all',
        JSON.stringify(mockUsers),
        30,
      );
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllActive', () => {
    const mockActiveUsers = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'USER' as Role,
        createdAt: new Date('2024-01-01'),
      },
    ];

    it('should return cached active users if available', async () => {
      const mockActiveUsersJson = JSON.stringify(mockActiveUsers);
      redisMock.get.mockResolvedValue(mockActiveUsersJson);

      const result = await service.findAllActive();

      expect(redisMock.get).toHaveBeenCalledWith('users:active');
      expect(prismaMock.user.findMany).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should filter by estatus ACTIVE', async () => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.user.findMany.mockResolvedValue(mockActiveUsers);

      await service.findAllActive();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { estatus: 'ACTIVE' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateRole', () => {
    it('should update user role', async () => {
      const updatedUser = {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'ADMIN' as Role,
        createdAt: new Date('2024-01-01'),
      };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateRole('user-1', 'ADMIN' as Role);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { role: 'ADMIN' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });
      expect(result.role).toBe('ADMIN');
    });

    it('should handle different roles', async () => {
      prismaMock.user.update.mockResolvedValue({
        id: 'user-1',
        role: 'GUEST' as Role,
      });

      const result = await service.updateRole('user-1', 'GUEST' as Role);

      expect(result.role).toBe('GUEST');
    });
  });

  describe('changeEstatus', () => {
    it('should update user estatus', async () => {
      const updatedUser = {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'USER' as Role,
        estatus: 'BLOCKED' as Estatus,
        createdAt: new Date('2024-01-01'),
      };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await service.changeEstatus('user-1', 'BLOCKED' as Estatus);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { estatus: 'BLOCKED' },
        select: { id: true, email: true, name: true, role: true, createdAt: true, estatus: true },
      });
      expect(result.estatus).toBe('BLOCKED');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const deletedUser = {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User 1',
        role: 'USER' as Role,
        createdAt: new Date('2024-01-01'),
      };
      prismaMock.user.delete.mockResolvedValue(deletedUser);

      const result = await service.deleteUser('user-1');

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });
      expect(result.id).toBe('user-1');
    });
  });
});