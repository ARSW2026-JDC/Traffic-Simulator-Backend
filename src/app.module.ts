import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { HistoryModule } from './history/history.module';
import { RedisModule } from './redis/redis.module';
import { AzureModule } from './azure/azure.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChatModule,
    HistoryModule,
    RedisModule,
    AzureModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}