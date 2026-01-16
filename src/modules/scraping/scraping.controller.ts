import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { baseResponse } from 'src/helpers/base-response';
import { validateJsonFile } from 'src/common/fileJsonValidation';
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Hasil scraping tersimpan' })
  async createResult(
    @Body() dto: CreateScrapeResultDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: ActiveUser,
  ) {
    validateJsonFile(file, {
      maxSize: 1024 * 1024 * 5, // 5MB
      allowedMimeTypes: [
        'application/json',
        'text/json',
        'application/octet-stream',
      ],
      requireJsonExtension: true,
    });

    const result = await this.scrapingService.createResult(dto, file, user.sub);
    return baseResponse('Hasil scraping tersimpan', result);
  }

  @Get('results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ambil semua hasil scraping' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil hasil scraping',
  })
  async getResults(@User() user: ActiveUser) {
    const results = await this.scrapingService.getResults(user.sub);
    return baseResponse('Berhasil mengambil hasil scraping', results);
  }

  @Delete('results/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus hasil scraping berdasarkan id' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil menghapus hasil scraping',
  })
  @ApiResponse({ status: 404, description: 'Hasil scraping tidak ditemukan' })
  async deleteResult(@Param('id') id: string) {
    await this.scrapingService.deleteResult(id);
    return baseResponse('Berhasil menghapus hasil scraping', null);
  }
}
