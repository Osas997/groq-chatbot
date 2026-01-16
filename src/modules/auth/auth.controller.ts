import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { LoginDto } from './dtos/login.dto';
import { baseResponse } from 'src/helpers/base-response';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { User } from './decorators/user.decorator';
import { ActiveUser } from './interfaces/user.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return baseResponse('Login successfully', data);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Refresh token successfully' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.generateRefreshToken(refreshTokenDto);
    return baseResponse('Refresh token successfully', data);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Get user successfully' })
  async me(@User() user: ActiveUser) {
    const data = await this.authService.me(user);
    return baseResponse('Get user successfully', data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logout successfully' })
  async logout(@User() user: ActiveUser) {
    const data = await this.authService.logout(user);
    return baseResponse('Logout successfully', data);
  }
}
