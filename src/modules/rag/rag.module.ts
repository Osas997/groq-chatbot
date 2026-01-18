import { Module, forwardRef } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './providers/rag.service';
import { PromptInsightsProvider } from './providers/prompt-insights.provider';
import { LoadDocumentsProvider } from './providers/load-documents.provider';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [forwardRef(() => ScrapingModule)],
  controllers: [RagController],
  providers: [RagService, PromptInsightsProvider, LoadDocumentsProvider],
  exports: [LoadDocumentsProvider, RagService],
})
export class RagModule {}
