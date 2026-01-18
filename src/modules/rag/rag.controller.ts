import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common';
import { RagService } from './providers/rag.service';
import { CreateQueryDto } from './dtos/create-query.dto';
import { baseResponse } from 'src/helpers/base-response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../auth/decorators/user.decorator';
import { ActiveUser } from '../auth/interfaces/user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);

  constructor(private readonly ragService: RagService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Ajukan pertanyaan ke sistem RAG' })
  @ApiResponse({ status: 200, description: 'Berhasil mendapat jawaban' })
  async queryUMKM(@Body() queryDto: CreateQueryDto) {
    this.logger.log(`Received query: ${queryDto.question}`);

    const answer = await this.ragService.queryRAG(queryDto.question);

    return baseResponse('Berhasil mendapat jawaban', answer);
  }

  @Post('query/:scraperId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ajukan pertanyaan ke sistem RAG (Scraper Context)' })
  @ApiResponse({ status: 200, description: 'Berhasil mendapat jawaban berdasarkan data user' })
  async queryScraper(
    @Param('scraperId') scraperId: string,
    @Body() queryDto: CreateQueryDto,
    @User() user: ActiveUser,
  ) {
    this.logger.log(`Received scraper query for scraper ${scraperId} from user ${user?.sub}: ${queryDto.question}`);

    const answer = await this.ragService.queryScraperRAG(scraperId, queryDto.question);

    return baseResponse('Berhasil mendapat jawaban', answer);
  }

  @Get('insights/:scraperId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ambil insights dari data RAG (Insights Scraper)' })
  @ApiResponse({ status: 200, description: 'Berhasil mendapat insights' })
  async insightsScraper(
    @Param('scraperId') scraperId: string,
    @User() user: ActiveUser,
  ) {
    const answer = await this.ragService.insightsScraperRAG(scraperId);

    return baseResponse('Berhasil mendapat insights', answer);
  }

  @Get('insights')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Ambil insights dari data RAG' })
  @ApiResponse({ status: 200, description: 'Berhasil mendapat insights' })
  async insights(): Promise<any> {
    this.logger.log('Processing insights');

    const insights = await this.ragService.getInsights();

    return baseResponse('Berhasil mendapat insights', insights);
  }
}
