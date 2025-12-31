import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
} from '@nestjs/common';
import { RagService } from './providers/rag.service';
import { CreateQueryDto } from './dtos/create-query.dto';
import { baseResponse } from 'src/helpers/base-response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

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
