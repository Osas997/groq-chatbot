import { Module } from '@nestjs/common';
import { UmkmController } from './umkm.controller';
import { UmkmService } from './providers/umkm.service';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [RagModule],
  controllers: [UmkmController],
  providers: [UmkmService],
})
export class UmkmModule {}
