import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from '../config/envs';

@Injectable()
export class RedisService implements OnModuleDestroy {

  readonly client: Redis;

  constructor() {
    const url = envs.redisUrl || 'redis://localhost:6379';
    this.client = new Redis(url);
    this.client.on('error', (e) => console.error('[redis:client]', e.message));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
