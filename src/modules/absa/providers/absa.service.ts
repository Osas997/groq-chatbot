import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentimentResult } from '../entities/sentiment_result.entity.entity';
import { DataSource, Repository } from 'typeorm';
import { SentimentComments } from '../entities/sentiment_comments.entity';
import { RecommendationResult } from '../entities/recommendation_result.entity';
import { RecommendationBestPosting } from '../entities/recommendation_best_posting.entity';
import { RecommendationCaptions } from '../entities/recommendation_captions.entity';
import { RecommendationHastags } from '../entities/recommendation_hastags.entity';
import { HttpService } from '@nestjs/axios';
import { ScrapingService } from 'src/modules/scraping/providers/scraping.service';
import { FileService } from 'src/common/file/file.service';

@Injectable()
export class AbsaService {
  constructor(
    @InjectRepository(SentimentResult)
    private sentimentResultRepository: Repository<SentimentResult>,
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
    private fileService: FileService,
    private dataSource: DataSource,
  ) {}

  async create(scraperId: string) {
    const scrapeResult = await this.scrapingService.getResultById(scraperId);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fileName = scrapeResult.fullData;
      const fileContent = await this.fileService.readJson(fileName, 'scraping');
      
      const formData = new FormData();
      const blob = new Blob([fileContent as any], { type: 'application/json' });
      formData.append('file', blob, fileName);
      const url = "https://unubiquitous-macie-unpromptly.ngrok-free.dev/api/absa";
      
      const response = await this.httpService.axiosRef.post(url, formData);
      
      const dataResponse =  response.data.data;

      const sentimentResult = await queryRunner.manager.save(SentimentResult, {
        summary: dataResponse.summary,
        sentiment_trend: dataResponse.sentiment_trend,
        scrapeResult   
      })

      for (const comment of dataResponse.comments) {
        await queryRunner.manager.save(SentimentComments, {
          sentimentResult,
          comment: comment.comment,
          food_quality: comment.food_quality,
          service: comment.service,
          price: comment.price,
        });
      }

      const contentResponse = dataResponse.content_recommendation;
      
      const recommendationResult = await queryRunner.manager.save(RecommendationResult, {
        sentimentResult,
        content_strategy: contentResponse?.content_strategy[0],
      })

      for (const caption of contentResponse?.captions) {
        await queryRunner.manager.save(RecommendationCaptions, {
          recommendationResult,
          caption,
        });
      }

      for (const hastag of contentResponse?.hashtags) {
        await queryRunner.manager.save(RecommendationHastags, {
          recommendationResult,
          hashtag: hastag,
        });
      }

      for (const bestPosting of contentResponse?.posting_times) {
        await queryRunner.manager.save(RecommendationBestPosting, {
          ...bestPosting,
          recommendationResult,
        });
      }

      await queryRunner.commitTransaction();

      return {
        sentimentResult: sentimentResult.id,
        recommendationResult: recommendationResult.id,
      }
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.response?.status || 500);
    } finally {
      await queryRunner.release();
    }
  }

  async getByIdScraping(scraperId: string) {
    const sentimentResult = await this.sentimentResultRepository.findOne({
      where: { scrapeResult: { id: scraperId } },
      select: {
        id: true,
        summary: true,
        sentiment_trend: true,
        sentimentComments: true,
      },
      relations: {
        sentimentComments: true,
      }
    });

    if(!sentimentResult) {
      throw new HttpException('Sentiment result not found', 404);
    }

    return sentimentResult;
  }

  async getRecommendationResult(scraperId: string) {
    const recommendationResult = await this.recommendationResultRepository.findOne({
      where: { 
        sentimentResult: { scrapeResult: { id: scraperId } },
      },
      select: {
        id: true,
        content_strategy: true,
        created_at: true,
      },
      relations: {
        recommendationCaptions: true,
        recommendationHastags: true,
        recommendationBestPostings: true,
      }
    });

    if(!recommendationResult) {
      throw new HttpException('Recommendation result not found', 404);
    }

    return recommendationResult;
  }
}
