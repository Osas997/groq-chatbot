import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
} from 'typeorm';

export class BaseCustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
