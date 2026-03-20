import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const uid: string = req.headers['x-user-id'];
    const email: string = req.headers['x-user-email'] || '';

    if (uid) {
      const user = await this.resolveUser(uid, email);
      if (user.estatus === 'BLOCKED') {
        throw new UnauthorizedException('User is blocked');
      }
      req.user = user;
      return true;
    }

    const auth = req.headers.authorization as string;
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token');

    const firebaseApp = getFirebaseAdmin();
    if (!firebaseApp) throw new UnauthorizedException('Auth not configured');

    try {
      const decoded = await admin.auth(firebaseApp).verifyIdToken(auth.split(' ')[1]);
      const user = await this.resolveUser(decoded.uid, decoded.email || '');
      if (user.estatus === 'BLOCKED') {
        throw new UnauthorizedException('User is blocked');
      }
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async resolveUser(uid: string, email: string) {
    let user = await this.prisma.user.findUnique({ where: { firebaseUid: uid } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { firebaseUid: uid, email: email || `${uid}@anon.com` },
      });
    }
    return user;
  }
}
