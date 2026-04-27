import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async verifyAndGetProfile(token: string, correlationId?: string) {
    this.logger.log({ msg: 'verifyAndGetProfile started', correlationId });
    const firebaseApp = getFirebaseAdmin();
    if (!firebaseApp) {
      this.logger.error({ msg: 'Firebase not configured', correlationId });
      throw new UnauthorizedException('Auth not configured');
    }
    this.logger.log({ msg: 'Firebase app configured', correlationId });

    let decoded: admin.auth.DecodedIdToken;
    try {
      decoded = await admin.auth(firebaseApp).verifyIdToken(token);
      this.logger.log({
        msg: 'Token verified successfully',
        uid: decoded.uid,
        correlationId,
      });
    } catch (err) {
      this.logger.warn({
        msg: 'Invalid token',
        error: err.message,
        correlationId,
      });
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email || `${decoded.uid}@anon.com`,
          name: decoded.name || null,
          avatarUrl: decoded.picture || null,
        },
      });
      this.logger.log({
        msg: 'User created',
        uid: decoded.uid,
        email: decoded.email,
        correlationId,
      });
    } else {
      if (decoded.picture && user.avatarUrl !== decoded.picture) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: decoded.picture },
        });
        this.logger.log({
          msg: 'User avatar updated',
          uid: decoded.uid,
          correlationId,
        });
      }
    }

    // Solo bloquear login para BLOCKED
    if (user.estatus === 'BLOCKED') {
      this.logger.warn({
        msg: 'Blocked user attempted login',
        uid: decoded.uid,
        correlationId,
      });
      throw new UnauthorizedException('User is blocked');
    }

    // Cambiar estatus a ACTIVE al hacer login (solo INACTIVE -> ACTIVE)
    if (user.estatus === 'INACTIVE') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { estatus: 'ACTIVE' },
      });
      this.logger.log({
        msg: 'User status changed to ACTIVE',
        uid: decoded.uid,
        correlationId,
      });
    }

    this.logger.log({
      msg: 'User authenticated',
      uid: decoded.uid,
      role: user.role,
      correlationId,
    });

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
