import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeResult } from './entities/scrape-result.entity';
import { ScrapingService } from './providers/scraping.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScrapeResult])],
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
