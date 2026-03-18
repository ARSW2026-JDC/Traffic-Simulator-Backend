import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyAndGetProfile(token: string) {
    const firebaseApp = getFirebaseAdmin();
    if (!firebaseApp) throw new UnauthorizedException('Auth not configured');

    let decoded: admin.auth.DecodedIdToken;
    try {
      decoded = await admin.auth(firebaseApp).verifyIdToken(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email || `${decoded.uid}@anon.com`,
          name: decoded.name || null,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
