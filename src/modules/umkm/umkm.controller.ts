import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UmkmService } from './providers/umkm.service';
import { baseResponse } from 'src/helpers/base-response';
import { Public } from '../auth/decorators/public.decorator';

@Controller('umkm')
export class UmkmController {
  constructor(private readonly umkmService: UmkmService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get()
  getJson() {
    const data = this.umkmService.getJson();
    return baseResponse('Success get data UMKM', data);
  }
}
