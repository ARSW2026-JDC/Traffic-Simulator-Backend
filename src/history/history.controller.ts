import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  getHistory(@Query('limit') limit: string, @Query('cursor') cursor?: string) {
    return this.historyService.getHistory(parseInt(limit || '50', 10), cursor);
  }
}
