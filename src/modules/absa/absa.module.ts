import { Module } from '@nestjs/common';
import { AbsaController } from './absa.controller';
import { AbsaService } from './providers/absa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentResult } from './entities/sentiment_result.entity.entity';
import { SentimentComments } from './entities/sentiment_comments.entity';
import { RecommendationResult } from './entities/recommendation_result.entity';
import { RecommendationBestPosting } from './entities/recommendation_best_posting.entity';
import { RecommendationCaptions } from './entities/recommendation_captions.entity';
import { RecommendationHastags } from './entities/recommendation_hastags.entity';
import { HttpModule } from '@nestjs/axios';
import { ScrapingModule } from '../scraping/scraping.module';
import { FileModule } from 'src/common/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SentimentResult,
      SentimentComments,
      RecommendationResult,
      RecommendationBestPosting,
      RecommendationCaptions,
      RecommendationHastags,
    ]),
    HttpModule,
    ScrapingModule,
    FileModule,
  ],
  controllers: [AbsaController],
  providers: [AbsaService],
})
export class AbsaModule {}
