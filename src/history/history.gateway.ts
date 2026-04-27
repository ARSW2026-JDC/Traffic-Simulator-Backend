import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { HistoryService } from './history.service';
import { PrismaService } from '../prisma/prisma.service';
import { getFirebaseAdmin } from '../auth/firebase-admin.provider';

@WebSocketGateway({ namespace: '/history', cors: { origin: '*' } })
export class HistoryGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly historyService: HistoryService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.historyService.setWsServer(server);
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);
      if (!token) {
        client.disconnect();
        return;
      }
      const firebaseApp = getFirebaseAdmin();
      if (!firebaseApp) {
        client.disconnect();
        return;
      }
      const decoded = await admin.auth(firebaseApp).verifyIdToken(token);
      const simId = (client.handshake.query?.simId as string) || (client.handshake.auth?.simId as string);
      if (simId) {
        client.join(`sim:${simId}`);
      } else {
        client.join(`user:${decoded.uid}`);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: Socket) {}
}
