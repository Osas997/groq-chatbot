import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SentimentResult } from './sentiment_result.entity';
import { RecommendationCaptions } from './recommendation_captions.entity';
import { RecommendationHastags } from './recommendation_hastags.entity';
import { RecommendationBestPosting } from './recommendation_best_posting.entity';

@Entity('recommendation_result')
export class RecommendationResult extends BaseCustomEntity {
  @Column({type: 'varchar', length: 255})
  content_strategy: string;

  @ManyToOne(
    () => SentimentResult,
    (sentimentResult) => sentimentResult.recommendationResults,
    { onDelete: 'CASCADE' }, // Add onDelete cascade
  )
  @JoinColumn({ name: 'sentiment_result_id' })
  sentimentResult: SentimentResult;

  @OneToMany(
    () => RecommendationCaptions,
    (recommendationCaptions) => recommendationCaptions.recommendationResult,
  )
  recommendationCaptions: RecommendationCaptions[];

  @OneToMany(
    () => RecommendationHastags,
    (recommendationHastags) => recommendationHastags.recommendationResult,
  )
  recommendationHastags: RecommendationHastags[];

  @OneToMany(
    () => RecommendationBestPosting,
    (recommendationBestPosting) =>
      recommendationBestPosting.recommendationResult,
  )
  recommendationBestPostings: RecommendationBestPosting[];
}
