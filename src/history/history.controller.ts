import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('history')
@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener historial de cambios de simulacion' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'simId', required: false })
  @ApiResponse({ status: 200, description: 'Lista de cambios' })
  getHistory(
    @Query('limit') limit: string,
    @Query('cursor') cursor: string,
    @Query('simId') simId: string,
  ) {
    return this.historyService.getHistory(parseInt(limit || '50', 10), cursor, simId);
  }
}