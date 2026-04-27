import { IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: '50', description: 'Cantidad de elementos' })
  @IsOptional()
  @IsString()
  @Min(1)
  @Max(100)
  limit?: string = '50';

  @ApiPropertyOptional({ description: 'Cursor para paginación' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class SimIdQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'ID de la simulación' })
  @IsOptional()
  @IsString()
  simId?: string;
}

export class RoleDto {
  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  @IsString()
  role: 'USER' | 'ADMIN';
}

export class EstatusDto {
  @ApiProperty({ example: 'BLOCKED', enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] })
  @IsString()
  estatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}