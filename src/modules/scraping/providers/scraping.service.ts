import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeResult } from '../entities/scrape-result.entity';
import { CreateScrapeResultDto } from '../dto/scrape.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/providers/users.service';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(ScrapeResult)
    private readonly scrapeResultRepository: Repository<ScrapeResult>,
    private readonly userService: UsersService,
  ) {}

  async createResult(dto: CreateScrapeResultDto, userId: string) {
    const user = await this.userService.findById(userId);

    const entity = this.scrapeResultRepository.create(dto);
    entity.user = user;

    const result = await this.scrapeResultRepository.save(entity);

    return {
      id: result.id,
    };
  }

  async getResults(): Promise<ScrapeResult[]> {
    return await this.scrapeResultRepository.find({
      order: { created_at: 'DESC' },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        postCount: true,
      },
    });
  }

  async getResultById(id: string): Promise<ScrapeResult> {
    const result = await this.scrapeResultRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        postCount: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Scrape result not found');
    }

    return result;
  }
}
