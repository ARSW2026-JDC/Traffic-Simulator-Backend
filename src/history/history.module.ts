
import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryGateway } from './history.gateway';
import { HistoryService } from './history.service';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [AuthModule, RedisModule],
  controllers: [HistoryController],
  providers: [HistoryGateway, HistoryService],
})
export class HistoryModule {}
