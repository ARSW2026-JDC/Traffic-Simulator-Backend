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

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('allActive')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  findAllActive() {
    return this.usersService.findAllActive();
  }

  @Patch(':id/estatus')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  changeEstatus(@Param('id') id: string, @Body() body: { estatus: Estatus }) {
    return this.usersService.changeEstatus(id, body.estatus);
  }
}
