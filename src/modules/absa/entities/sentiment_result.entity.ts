import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SentimentComments } from './sentiment_comments.entity';
import { RecommendationResult } from './recommendation_result.entity';
import { ScrapeResult } from 'src/modules/scraping/entities/scrape-result.entity';

@Entity('sentiment_result')
export class SentimentResult extends BaseCustomEntity {
  @Column({type: 'jsonb'})
  summary: any;
  
  @Column({type: 'jsonb'})
  sentiment_trend: any;

  @ManyToOne(
    () => ScrapeResult,
    (scrapeResult) => scrapeResult.sentimentResults,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'scrape_result_id' })
  scrapeResult: ScrapeResult;

  @OneToMany(
    () => SentimentComments,
    (sentimentComments) => sentimentComments.sentimentResult,
  )
  sentimentComments: SentimentComments[];

  @OneToMany(
    () => RecommendationResult,
    (recommendationResult) => recommendationResult.sentimentResult,
  )
  recommendationResults: RecommendationResult[];
}
