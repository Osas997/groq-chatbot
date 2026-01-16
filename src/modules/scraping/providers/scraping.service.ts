import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeResult } from '../entities/scrape-result.entity';
import { CreateScrapeResultDto } from '../dto/scrape.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/providers/users.service';
import { FileService } from 'src/common/file/file.service';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(ScrapeResult)
    private readonly scrapeResultRepository: Repository<ScrapeResult>,
    private readonly userService: UsersService,
    private readonly fileService: FileService,
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

  async getResults(userId: string): Promise<ScrapeResult[]> {
    const user = await this.userService.findById(userId);

    return await this.scrapeResultRepository.find({
      order: { created_at: 'DESC' },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        postCount: true,
      },
      where: {
        user: {
          id: user.id,
        }
      },
    });
  }

  async getResultById(id: string): Promise<ScrapeResult> {
    const result = await this.scrapeResultRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullData: true,
      },
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

    await this.scrapeResultRepository.delete(id);
  }
}
