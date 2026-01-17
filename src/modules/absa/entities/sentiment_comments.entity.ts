import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SentimentResult } from './sentiment_result.entity';
import { Sentiment } from '../enums/sentiment.enum';

@Entity('sentiment_comments')
export class SentimentComments extends BaseCustomEntity {
  @Column({ unique: false, nullable: false, type: 'varchar', length: 800 })
  comment: string;

  @Column({
    nullable: false,
    name: 'food_quality',
    type: 'simple-enum',
    enum: Sentiment,
  })
  food_quality: Sentiment;

  @Column({
    nullable: false,
    name: 'price',
    type: 'simple-enum',
    enum: Sentiment,
  })
  price: Sentiment;

  @Column({
    nullable: false,
    name: 'service',
    type: 'simple-enum',
    enum: Sentiment,
  })
  service: Sentiment;

  @ManyToOne(
    () => SentimentResult,
    (sentimentResult) => sentimentResult.sentimentComments,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'sentiment_result_id' })
  sentimentResult: SentimentResult;
}
