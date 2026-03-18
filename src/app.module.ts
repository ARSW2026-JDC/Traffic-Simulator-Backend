import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChatModule, HistoryModule],
})
export class AppModule {}
