import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async verifyAndGetProfile(token: string, correlationId?: string) {
    const firebaseApp = getFirebaseAdmin();
    if (!firebaseApp) {
      this.logger.error({ msg: 'Firebase not configured', correlationId });
      throw new UnauthorizedException('Auth not configured');
    }

    let decoded: admin.auth.DecodedIdToken;
    try {
      decoded = await admin.auth(firebaseApp).verifyIdToken(token);
    } catch (err) {
      this.logger.warn({ msg: 'Invalid token', error: err.message, correlationId });
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (!user) {
      const isGuest = decoded.provider_id === 'anonymous';
      const usersGuestCount = await this.prisma.user.count({ where: { role: 'GUEST' } });
      if (isGuest && usersGuestCount >= 50) {
        this.logger.warn({ msg: 'Guest limit reached', count: usersGuestCount, correlationId });
        throw new UnauthorizedException('Guest user limit reached');
      }
      try {
        if (isGuest) {
          user = await this.prisma.user.create({
            data: {
              firebaseUid: decoded.uid,
              email: decoded.email || `${decoded.uid}@anon.com`,
              name: decoded.name || `Guest${usersGuestCount + 1}`,
              role: 'GUEST',
              avatarUrl: decoded.picture || null,
            },
          });
          this.logger.log({ msg: 'Guest user created', uid: decoded.uid, correlationId });
        } else {
          user = await this.prisma.user.create({
            data: {
              firebaseUid: decoded.uid,
              email: decoded.email ? decoded.email : `${decoded.uid}@anon.com`,
              name: decoded.name || null,
              avatarUrl: decoded.picture || null,
            },
          });
          this.logger.log({ msg: 'User created', uid: decoded.uid, email: decoded.email, correlationId });
        }
      } catch (err) {
        this.logger.error({ msg: 'Error creating user', error: err.message, correlationId });
      }
    } else if (decoded.picture && user.avatarUrl !== decoded.picture) {
      try {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: decoded.picture },
        });
        this.logger.log({ msg: 'User avatar updated', uid: decoded.uid, correlationId });
      } catch (err) {
        this.logger.error({ msg: 'Error updating avatar', error: err.message, correlationId });
      }
    }

    if (user.estatus === 'BLOCKED') {
      this.logger.warn({ msg: 'Blocked user attempted login', uid: decoded.uid, correlationId });
      throw new UnauthorizedException('User is blocked');
    }

    this.logger.log({ msg: 'User authenticated', uid: decoded.uid, role: user.role, correlationId });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
