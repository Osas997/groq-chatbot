import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeResult } from './entities/scrape-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScrapeResult])],
  controllers: [ScrapingController],
})
export class ScrapingModule {}
