import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { RecommendationResult } from './recommendation_result.entity';

@Entity('recommendation_best_posting')
export class RecommendationBestPosting extends BaseCustomEntity {
  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ type: 'varchar', length: 255 })
  day: string;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ type: 'varchar', length: 255 })
  engagement_potential: string;

  @Column({ type: 'varchar', length: 255 })
  best_content: string;

  @ManyToOne(
    () => RecommendationResult,
    (recommendationResult) => recommendationResult.recommendationBestPostings,
  )
  @JoinColumn({ name: 'recommendation_result_id' })
  recommendationResult: RecommendationResult;
}
