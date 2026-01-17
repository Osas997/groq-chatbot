import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { RecommendationResult } from './recommendation_result.entity';

@Entity('recommendation_hastags')
export class RecommendationHastags extends BaseCustomEntity {
  @Column({ type: 'varchar', length: 255 })
  hashtag: string;

  @ManyToOne(
    () => RecommendationResult,
    (recommendationResult) => recommendationResult.recommendationHastags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'recommendation_result_id' })
  recommendationResult: RecommendationResult;
}
