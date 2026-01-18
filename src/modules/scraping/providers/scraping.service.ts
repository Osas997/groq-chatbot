import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeResult } from '../entities/scrape-result.entity';
import { CreateScrapeResultDto } from '../dto/scrape.dto';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/providers/users.service';
import { FileService } from 'src/common/file/file.service';
import { Parser } from 'json2csv';
import * as ExcelJS from 'exceljs';
import { Inject, forwardRef } from '@nestjs/common';
import { RagService } from 'src/modules/rag/providers/rag.service';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(ScrapeResult)
    private readonly scrapeResultRepository: Repository<ScrapeResult>,
    private readonly userService: UsersService,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => RagService))
    private readonly ragService: RagService,
  ) {}

  async createResult(
    dto: CreateScrapeResultDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    const user = await this.userService.findById(userId);

    const filename = await this.fileService.saveJson(file, 'scraping');

    const entity = this.scrapeResultRepository.create({
      ...dto,
      fullData: filename,
    });
    entity.user = user;

    const result = await this.scrapeResultRepository.save(entity);

    return {
      id: result.id,
      filename: filename,
    };
  }

  async getResults(userId: string) {
    const user = await this.userService.findById(userId);

    const results = await this.scrapeResultRepository.find({
      order: { created_at: 'DESC' },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        postCount: true,
      },
      relations: {
        sentimentResults: true,
      },
      where: {
        user: {
          id: user.id,
        }
      },
    });

    return results.map((result) => {
      return {
        id: result.id,
        username: result.username,
        full_name: result.fullName,
        bio: result.bio,
        post_count: result.postCount,
        is_analyzed: result.sentimentResults ? true : false,
      };
    });
  }

  async getResultById(id: string): Promise<ScrapeResult> {
    const result = await this.scrapeResultRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullData: true,
        user: {
          id: true,
        }
      },
      relations: {
        user: true,
      }
    });

    if (!result) {
      throw new NotFoundException('Scrape not found');
    }

    return result;
  }

  async deleteResult(id: string): Promise<void> {
    const result = await this.scrapeResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Scrape result not found');
    }

    try {
      await this.fileService.deleteJson(result.fullData, 'scraping');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }

    if(result.sentimentResults){
      await this.ragService.deleteScraperData(id);
    }
    
    await this.scrapeResultRepository.delete(id);
  }

  async downloadCsv(id: string): Promise<string> {
    const result = await this.getResultById(id);
    const fileContent = await this.fileService.readJson(result.fullData, 'scraping');
    const jsonData = JSON.parse(fileContent.toString());

    // Flatten the data if it's an array, or wrap it in an array if it's an object
    const data = Array.isArray(jsonData) ? jsonData : [jsonData];

    const parser = new Parser();
    const csv = parser.parse(data);

    return csv;
  }

  async downloadExcel(id: string): Promise<Buffer> {
    const result = await this.getResultById(id);
    const fileContent = await this.fileService.readJson(result.fullData, 'scraping');
    const jsonData = JSON.parse(fileContent.toString());

    const data = Array.isArray(jsonData) ? jsonData : [jsonData];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scraping Result');

    if (data.length > 0) {
      // Generate headers from the keys of the first object
      const headers = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
        width: 20, // Default width
      }));

      worksheet.columns = headers;

      // Add rows
      worksheet.addRows(data);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as any;
  }
}
