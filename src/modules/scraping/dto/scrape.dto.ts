import {
  IsObject,
  IsNotEmptyObject,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScrapeResultDto {
  @ApiProperty({
    description: 'File JSON hasil scraping',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file: any;

  @ApiProperty({
    description: 'Username yang di-scrape',
    type: String,
    example: 'example_user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Full name dari pengguna',
    type: String,
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Bio dari pengguna',
    type: String,
    example:
      'Software developer passionate about creating amazing applications.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Jumlah post dari pengguna',
    type: Number,
    example: 42,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  postCount?: number;
}
