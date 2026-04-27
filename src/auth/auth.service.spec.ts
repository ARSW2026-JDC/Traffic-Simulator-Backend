import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, jest, beforeEach} from '@jest/globals';

const mockFirebaseAuth = {
  verifyIdToken: jest.fn(),
};

const mockFirebaseApp = {
  auth: jest.fn(() => mockFirebaseAuth),
};

jest.mock('./firebase-admin.provider', () => ({
  getFirebaseAdmin: jest.fn(() => mockFirebaseApp),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    prismaMock = {
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('verifyAndGetProfile', () => {
    const mockUser = {
      id: 'user-1',
      firebaseUid: 'uid-1',
      email: 'test@example.com',
      name: 'Test',
      avatarUrl: null,
      role: 'USER' as const,
      estatus: 'ACTIVE' as const,
      createdAt: new Date(),
    };

    it('should throw when Firebase not configured', async () => {
      const { getFirebaseAdmin } = require('./firebase-admin.provider');
      (getFirebaseAdmin as jest.Mock).mockReturnValue(null);

      await expect(service.verifyAndGetProfile('token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user when exists', async () => {
      mockFirebaseAuth.verifyIdToken.mockResolvedValue({ uid: 'uid-1', provider_id: 'password' });
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.verifyAndGetProfile('valid-token');

      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });

    it('should create new user when not exists', async () => {
      mockFirebaseAuth.verifyIdToken.mockResolvedValue({ uid: 'new-uid', email: 'new@test.com', provider_id: 'password' });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.user.create.mockResolvedValue({ ...mockUser, id: 'new-id', email: 'new@test.com' });

      const result = await service.verifyAndGetProfile('token');

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result.email).toBe('new@test.com');
    });

    it('should throw when guest limit reached', async () => {
      mockFirebaseAuth.verifyIdToken.mockResolvedValue({ uid: 'guest', provider_id: 'anonymous' });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(50);

      await expect(service.verifyAndGetProfile('token')).rejects.toThrow('Guest user limit reached');
    });

    it('should throw when user blocked', async () => {
      mockFirebaseAuth.verifyIdToken.mockResolvedValue({ uid: 'uid-1', provider_id: 'password' });
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, estatus: 'BLOCKED' });

      await expect(service.verifyAndGetProfile('token')).rejects.toThrow('User is blocked');
    });
  });
});