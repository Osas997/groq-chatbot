import {Controller, Post, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { AbsaService } from './providers/absa.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
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
  async getByIdScraping(@Param("scraperId", new ParseUUIDPipe()) scraperId: string) {
    const result = await this.absaService.getByIdScraping(scraperId);
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
