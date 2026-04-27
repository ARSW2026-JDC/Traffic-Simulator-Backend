import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { Estatus, Role } from '@prisma/client';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

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
  @ApiBody({ schema: { example: { role: 'USER' } } })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('allActive')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Obtener usuarios activos' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de usuarios activos' })
  findAllActive() {
    return this.usersService.findAllActive();
  }

  @Patch(':id/estatus')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cambiar estatus de usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ schema: { example: { estatus: 'BLOCKED' } } })
  @ApiResponse({ status: 200, description: 'Estatus actualizado' })
  changeEstatus(@Param('id') id: string, @Body() body: { estatus: Estatus }) {
    return this.usersService.changeEstatus(id, body.estatus);
  }
}
