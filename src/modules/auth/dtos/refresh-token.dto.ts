// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  // @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty({ message: 'refresh_token Harus diisi' })
  @IsString({ message: 'refresh_token Harus berupa string' })
  refresh_token: string;
}
