import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @ApiOperation({
    summary: 'Verificar token de Firebase y obtener perfil de usuario',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Perfil de usuario válido' })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o usuario bloqueado',
  })
  async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    // console.log('Verifying token:', authHeader);
    return this.authService.verifyAndGetProfile(authHeader.split(' ')[1]);
  }
}
