import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Role, Estatus } from '@prisma/client';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoleDto, EstatusDto } from '../shared/dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar rol de usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: RoleDto })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  updateRole(@Param('id') id: string, @Body() body: RoleDto) {
    return this.usersService.updateRole(id, body.role);
  }

  @Patch(':id/estatus')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cambiar estatus de usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: EstatusDto })
  @ApiResponse({ status: 200, description: 'Estatus actualizado' })
  changeEstatus(@Param('id') id: string, @Body() body: EstatusDto) {
    return this.usersService.changeEstatus(id, body.estatus);
  }
}
