import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Username pengguna' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Password pengguna' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Konfirmasi password' })
  confirm_password: string;
}
