import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity({ name: 'scrape_results' })
@Index(['data'])
export class ScrapeResult extends BaseCustomEntity {
  @Column({ unique: true, nullable: false, type: 'varchar', length: 255 })
  username: string;

  @Column({ nullable: true, type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  bio: string;

  @Column({ nullable: true, type: 'integer' })
  postCount: number;

  @Column({ type: 'jsonb' })
  data: any;

  @ManyToOne(() => User, (user) => user.scrapeResults)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
