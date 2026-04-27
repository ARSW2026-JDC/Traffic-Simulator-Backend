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
      // Guest si es anónimo o el email termina en @anon.com
      const isGuest = (decoded.provider_id === 'anonymous')
      // Contar cuántos usuarios guest hay actualmente
      const usersGuestCount = await this.prisma.user.count({ where: { role: 'GUEST' } });
      // Limitar a 50 usuarios guest simultáneos
      if (isGuest && usersGuestCount >= 50) {
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
        } else {
          user = await this.prisma.user.create({
            data: {
              firebaseUid: decoded.uid,
              email: decoded.email ? decoded.email : `${decoded.uid}@anon.com`,
              name: decoded.name || null,
              avatarUrl: decoded.picture || null,
            },
          });
        }
      } catch (err) {
        console.error('Error creating user:', err);
      }
    } else if (decoded.picture && user.avatarUrl !== decoded.picture) {
      try {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: decoded.picture },
        });
      } catch (err) {
        console.error('Error updating user avatar:', err);
      }
    }

    if (user.estatus === 'BLOCKED') {
      throw new UnauthorizedException('User is blocked');
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
