import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './providers/rag.service';
import { PromptInsightsProvider } from './providers/prompt-insights.provider';
import { LoadDocumentsProvider } from './providers/load-documents.provider';

@Module({
  controllers: [RagController],
  providers: [RagService, PromptInsightsProvider, LoadDocumentsProvider],
  exports: [LoadDocumentsProvider],
})
export class RagModule {}
