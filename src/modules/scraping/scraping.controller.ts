import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { baseResponse } from 'src/helpers/base-response';
import { CreateScrapeResultDto } from './dto/scrape.dto';
import { ScrapingService } from './providers/scraping.service';
import { User } from '../auth/decorators/user.decorator';
import { ActiveUser } from '../auth/interfaces/user.interface';

@ApiTags('Scraping')
@ApiBearerAuth()
@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('results')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Simpan hasil scraping ke database' })
  @ApiResponse({ status: 201, description: 'Hasil scraping tersimpan' })
  async createResult(
    @Body() dto: CreateScrapeResultDto,
    @User() user: ActiveUser,
  ) {
    const result = await this.scrapingService.createResult(dto, user.sub);
    return baseResponse('Hasil scraping tersimpan', result);
  }

  @Get('results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ambil semua hasil scraping' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil hasil scraping',
  })
  async getResults() {
    const results = await this.scrapingService.getResults();
    return baseResponse('Berhasil mengambil hasil scraping', results);
  }

  @Get('results/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ambil detail hasil scraping berdasarkan id' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil detail hasil scraping',
  })
  @ApiResponse({ status: 404, description: 'Hasil scraping tidak ditemukan' })
  async getResultById(@Param('id') id: string) {
    const result = await this.scrapingService.getResultById(id);
    return baseResponse('Berhasil mengambil detail hasil scraping', result);
  }
}
