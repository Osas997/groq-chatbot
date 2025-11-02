import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { LoginDto } from './dtos/login.dto';
import { baseResponse } from 'src/helpers/base-response';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return baseResponse('Login successfully', data);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.generateRefreshToken(refreshTokenDto);
    return baseResponse('Refresh token successfully', data);
  }
}
