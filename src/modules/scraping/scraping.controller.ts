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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  @Get('results/:id/download/csv')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download hasil scraping dalam format CSV' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mendownload CSV',
  })
  async downloadCsv(@Param('id') id: string, @Res() res: Response) {
    const csv = await this.scrapingService.downloadCsv(id);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="scraping-result.csv"');
    res.send(csv);
  }

  @Get('results/:id/download/excel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download hasil scraping dalam format Excel' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mendownload Excel',
  })
  async downloadExcel(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.scrapingService.downloadExcel(id);
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.header(
      'Content-Disposition',
      'attachment; filename="scraping-result.xlsx"',
    );
    res.send(buffer);
  }
}
