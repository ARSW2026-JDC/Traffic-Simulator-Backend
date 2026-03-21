import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { getFirebaseAdmin } from '../auth/firebase-admin.provider';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

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
      let user = await this.prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
      if (!user) {
        client.disconnect();
        return;
      }

      // Si el usuario está baneado o bloqueado, no permitir conexión
      if (user.estatus === 'BANNED' || user.estatus === 'BLOCKED') {
        client.disconnect();
        return;
      }
      // Cambiar estatus a ACTIVE al conectar solo si no está bloqueado
      if (user.estatus !== 'ACTIVE') {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { estatus: 'ACTIVE' },
        });
      }

      client.data.userId = user.id;
      client.data.userName = user.name || user.email;
      client.data.role = user.role;
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // Cambiar estatus a INACTIVE al desconectar solo si no está bloqueado
    if (client.data?.userId) {
      try {
        const user = await this.prisma.user.findUnique({ where: { id: client.data.userId } });
        if (user && user.estatus !== 'BLOCKED') {
          await this.prisma.user.update({
            where: { id: client.data.userId },
            data: { estatus: 'INACTIVE' },
          });
        }
      } catch (e) {
        // Ignorar errores de desconexión
      }
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string },
  ) {
    if (!client.data.userId || !data?.content?.trim()) return;
    const msg = await this.chatService.saveMessage(client.data.userId, data.content.trim());
    this.server.emit('message:new', msg);
  }
}
