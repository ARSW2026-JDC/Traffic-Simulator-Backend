import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: any) {
    const u = req.user;
    return { id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt };
  }

  @Patch('me')
  updateMe(@Request() req: any, @Body() body: { name?: string }) {
    return this.usersService.updateMe(req.user.id, body);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.usersService.updateRole(id, body.role);
  }
}
