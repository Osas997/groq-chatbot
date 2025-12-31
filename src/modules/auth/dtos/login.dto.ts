import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username pengguna' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Password pengguna' })
  password: string;
}
