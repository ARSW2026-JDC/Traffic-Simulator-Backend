import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  getMessages(@Query('limit') limit: string, @Query('cursor') cursor?: string) {
    return this.chatService.getMessages(parseInt(limit || '50', 10), cursor);
  }
}
