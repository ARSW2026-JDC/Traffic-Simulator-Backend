import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Role } from '@prisma/client';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN , Role.USER)
  getMessages(@Query('limit') limit: string, @Query('cursor') cursor?: string) {
    return this.chatService.getMessages(parseInt(limit || '50', 10), cursor);
  }
}
