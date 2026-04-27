import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SimIdQueryDto } from '../shared/dto';

@ApiTags('history')
@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener historial de cambios de simulacion' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de cambios' })
  getHistory(@Query() query: SimIdQueryDto) {
    return this.historyService.getHistory(
      parseInt(query.limit || '50', 10),
      query.cursor,
      query.simId,
    );
  }
}