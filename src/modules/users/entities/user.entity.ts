import { BaseCustomEntity } from 'src/common/base-custom.entity';
import { ScrapeResult } from 'src/modules/scraping/entities/scrape-result.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseCustomEntity {
  @Column({ unique: true, type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true, name: 'refresh_token' })
  refreshToken: string | null;

  @OneToMany(() => ScrapeResult, (scrapeResult) => scrapeResult.user)
  scrapeResults: ScrapeResult[];
}
