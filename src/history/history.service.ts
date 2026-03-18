import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HistoryService implements OnModuleInit {
  private wsServer: Server | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  setWsServer(server: Server) {
    this.wsServer = server;
  }

  async onModuleInit() {
    await this.redis.subscriber.subscribe('simulation:changes');
    this.redis.subscriber.on('message', async (channel, raw) => {
      if (channel !== 'simulation:changes') return;
      try {
        const change = JSON.parse(raw);
        const entry = await this.saveChange(change);
        this.wsServer?.emit('history:new', entry);
      } catch (err) {
        console.error('[history] failed to persist change:', err);
      }
    });
  }

  async saveChange(data: {
    userId: string;
    entityType: string;
    entityId: string;
    field: string;
    oldValue: string;
    newValue: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { name: true, email: true },
    });

    const entry = await this.prisma.changeLog.create({ data });

    return {
      id: entry.id,
      userId: entry.userId,
      userName: user?.name || user?.email || 'Unknown',
      entityType: entry.entityType,
      entityId: entry.entityId,
      field: entry.field,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      timestamp: entry.timestamp.getTime(),
    };
  }

  async getHistory(limit = 50, cursor?: string) {
    const entries = await this.prisma.changeLog.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return entries.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.user.name || e.user.email,
      entityType: e.entityType,
      entityId: e.entityId,
      field: e.field,
      oldValue: e.oldValue,
      newValue: e.newValue,
      timestamp: e.timestamp.getTime(),
    }));
  }
}
