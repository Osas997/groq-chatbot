import {Controller, Post, Param, ParseUUIDPipe, Get, Query, DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AbsaService } from './providers/absa.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { baseResponse } from 'src/helpers/base-response';

@Controller('absa')
@ApiBearerAuth()
export class AbsaController {
  constructor(private readonly absaService: AbsaService) {}

  @Post(":scraperId")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Simpan hasil scraping ke database' })
  @ApiResponse({ status: 201, description: 'Hasil scraping tersimpan' })
  async create(@Param("scraperId", new ParseUUIDPipe()) scraperId: string) {
    const result = await this.absaService.create(scraperId);
    return baseResponse("Success analyze absa", result);
  }

  @Get("/:scraperId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mendapatkan hasil absa berdasarkan id' })
  @ApiResponse({ status: 200, description: 'Hasil absa ditemukan' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  async getByIdScraping(
    @Param("scraperId", new ParseUUIDPipe()) scraperId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.absaService.getByIdScraping(scraperId, page, limit);
    return baseResponse("Success get absa result", result);
  }

  @Get("/:scraperId/recommendation")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mendapatkan hasil absa berdasarkan id' })
  @ApiResponse({ status: 200, description: 'Hasil absa ditemukan' })
  async getRecommendationResult(@Param("scraperId", new ParseUUIDPipe()) scraperId: string) {
    const result = await this.absaService.getRecommendationResult(scraperId);
    return baseResponse("Success get absa result", result);
  }
}
