import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { RecommendationResult } from './recommendation_result.entity';

@Entity('recommendation_captions')
export class RecommendationCaptions extends BaseCustomEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @ManyToOne(
    () => RecommendationResult,
    (recommendationResult) => recommendationResult.recommendationCaptions,
  )
  @JoinColumn({ name: 'recommendation_result_id' })
  recommendationResult: RecommendationResult;
}
