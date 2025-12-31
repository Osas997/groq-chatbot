import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UmkmService } from './providers/umkm.service';
import { baseResponse } from 'src/helpers/base-response';
import { Public } from '../auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('UMKM')
@Controller('umkm')
export class UmkmController {
  constructor(private readonly umkmService: UmkmService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get()
  @ApiOperation({ summary: 'Daftar data UMKM (public)' })
  @ApiResponse({ status: 200, description: 'Success get data UMKM' })
  getJson() {
    const data = this.umkmService.getJson();
    return baseResponse('Success get data UMKM', data);
  }
}
