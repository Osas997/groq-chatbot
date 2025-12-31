import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Pertanyaan yang ingin diajukan' })
  question: string;
}
