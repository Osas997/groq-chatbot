import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { SentimentResult } from 'src/modules/absa/entities/sentiment_result.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'scrape_results' })
export class ScrapeResult extends BaseCustomEntity {
  @Column({ unique: false, nullable: false, type: 'varchar', length: 255 })
  username: string;

  @Column({ nullable: true, type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  bio: string;

  @Column({ nullable: true, name: 'post_count', type: 'integer' })
  postCount: number;

  @Column({ type: 'varchar', name: 'full_data', length: 255 })
  fullData: string;

  @ManyToOne(() => User, (user) => user.scrapeResults)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(
    () => SentimentResult,
    (sentimentResult) => sentimentResult.scrapeResult,
    { onDelete: 'CASCADE' },
  )
  sentimentResults: SentimentResult;
}
