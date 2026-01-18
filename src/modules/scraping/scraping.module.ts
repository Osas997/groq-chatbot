import { Module, forwardRef } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeResult } from './entities/scrape-result.entity';
import { ScrapingService } from './providers/scraping.service';
import { UsersModule } from '../users/users.module';
import { FileModule } from 'src/common/file/file.module';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrapeResult]),
    UsersModule,
    FileModule,
    forwardRef(() => RagModule),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
