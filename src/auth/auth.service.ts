import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { PrismaService } from '../prisma/prisma.service';

const MAX_GUEST_USERS = 200;

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
      this.logger.log({
        msg: 'Token verified successfully',
        uid: decoded.uid,
        email: decoded.email,
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

    const isGuest = !decoded.email;
    this.logger.log({ msg: 'isGuest detected', isGuest, correlationId });

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      this.logger.log({ msg: 'Creating new user', isGuest, correlationId });
      if (isGuest) {
        const guestCount = await this.prisma.user.count({ 
          where: { role: 'GUEST', estatus: 'ACTIVE' } 
        });
        this.logger.log({ msg: 'Active guest count', count: guestCount, correlationId });

        if (guestCount >= MAX_GUEST_USERS) {
          this.logger.warn({
            msg: 'Active guest limit reached',
            count: guestCount,
            limit: MAX_GUEST_USERS,
            correlationId,
          });
          throw new UnauthorizedException('Guest user limit reached. Please try again later.');
        }

        user = await this.prisma.user.create({
          data: {
            firebaseUid: decoded.uid,
            email: null,
            name: `Guest${guestCount + 1}`,
            role: 'GUEST',
            avatarUrl: decoded.picture || null,
          },
        });
        this.logger.log({
          msg: 'Guest user created',
          uid: decoded.uid,
          correlationId,
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            firebaseUid: decoded.uid,
            email: decoded.email,
            name: decoded.name || null,
            avatarUrl: decoded.picture || null,
            role: 'USER',
          },
        });
        this.logger.log({
          msg: 'User created',
          uid: decoded.uid,
          email: decoded.email,
          correlationId,
        });
      }
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
    }


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