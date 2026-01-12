import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GenerateTokens } from './generate-tokens';
import { UsersService } from 'src/modules/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUser } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly generateTokens: GenerateTokens,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { password, username } = loginDto;
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = await this.generateTokens.generateTokens(user);

    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      username: user.username,
      ...tokens,
    };
  }

  async generateRefreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    const sub = await this.generateTokens.verifyRefreshToken(refresh_token);

    const user = await this.usersService.findById(sub);

    if (refresh_token !== user.refreshToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const newAccessToken = await this.generateTokens.generateTokens(user);
    return newAccessToken.access_token;
  }

  async me(user: ActiveUser) {
    const data = await this.usersService.findById(user.sub);
    return {
      id: data.id,
      username: data.username,
    };
  }

  async logout(user: ActiveUser) {
    await this.usersService.updateRefreshToken(user.sub, null);
  }
}
