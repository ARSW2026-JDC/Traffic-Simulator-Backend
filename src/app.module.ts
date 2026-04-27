
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { HistoryModule } from './history/history.module';
import { RedisModule } from './redis/redis.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChatModule, HistoryModule, RedisModule],
  controllers: [HealthController],
})
export class AppModule {}
