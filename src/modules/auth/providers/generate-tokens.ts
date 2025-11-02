import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class GenerateTokens {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken<T>(
    user_id: string,
    expiresIn: string,
    secret?: string,
    payload?: T,
  ) {
    let token: string | undefined;
    token = await this.jwtService.signAsync(
      { sub: user_id, ...payload },
      {
        secret: secret ?? this.configService.get('jwt.secret'),
        expiresIn: expiresIn as any,
      },
    );

    return token;
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Create access token
      this.signToken(
        user.id,
        this.configService.get('jwt.accessTokenTtl')!,
        undefined,
      ),
      // Create refresh token
      this.signToken(
        user.id,
        this.configService.get('jwt.refreshTokenTtl')!,
        this.configService.get('jwt.refreshSecret'),
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
