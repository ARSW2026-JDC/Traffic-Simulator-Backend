
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from '../config/envs';

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client: Redis;

  constructor() {
    const url = envs.redisUrl || 'redis://localhost:6379';
    this.client = new Redis(url);
  }

  
  /**
   * Obtiene un valor del caché por clave
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Guarda un valor en el caché con TTL opcional (segundos)
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Elimina un valor del caché por clave
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
