import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, jest, beforeEach, skip } from '@jest/globals';

jest.mock('./firebase-admin.provider', () => ({
  getFirebaseAdmin: jest.fn(),
}));

jest.mock('../config/envs', () => ({
  envs: {
    get databaseurl() { return 'mock://test'; },
  },
}));

describe('AuthService (unit tests only)', () => {
  let service: AuthService;
  let prismaMock: any;
  let getFirebaseAdminMock: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    const { getFirebaseAdmin } = require('./firebase-admin.provider');
    getFirebaseAdminMock = getFirebaseAdmin as jest.Mock;
    getFirebaseAdminMock.mockReturnValue(null);

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
    it('should throw when Firebase not configured', async () => {
      getFirebaseAdminMock.mockReturnValueOnce(null);

      await expect(service.verifyAndGetProfile('token')).rejects.toThrow(
        'Auth not configured',
      );
    });
  });
});