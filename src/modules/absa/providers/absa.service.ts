import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentimentResult } from '../entities/sentiment_result.entity.entity';
import { Repository } from 'typeorm';
import { SentimentComments } from '../entities/sentiment_comments.entity';
import { RecommendationResult } from '../entities/recommendation_result.entity';
import { RecommendationBestPosting } from '../entities/recommendation_best_posting.entity';
import { RecommendationCaptions } from '../entities/recommendation_captions.entity';
import { RecommendationHastags } from '../entities/recommendation_hastags.entity';
import { HttpService } from '@nestjs/axios';
import { ScrapingService } from 'src/modules/scraping/providers/scraping.service';

@Injectable()
export class AbsaService {
  constructor(
    @InjectRepository(SentimentResult)
    private absaRepository: Repository<SentimentResult>,
    @InjectRepository(SentimentComments)
    private sentimentCommentsRepository: Repository<SentimentComments>,
    @InjectRepository(RecommendationResult)
    private recommendationResultRepository: Repository<RecommendationResult>,
    @InjectRepository(RecommendationBestPosting)
    private recommendationBestPostingRepository: Repository<RecommendationBestPosting>,
    @InjectRepository(RecommendationCaptions)
    private recommendationCaptionsRepository: Repository<RecommendationCaptions>,
    @InjectRepository(RecommendationHastags)
    private recommendationHastagsRepository: Repository<RecommendationHastags>,
    private httpService: HttpService,
    private scrapingService: ScrapingService,
  ) {}

  async create(scraperId: string) {
    const scrapeResult = await this.scrapingService.getResultById(scraperId);
    
    return scrapeResult;

  }
}
