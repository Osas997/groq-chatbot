import { Injectable } from '@nestjs/common';
import { LoadDocumentsProvider } from 'src/modules/rag/providers/load-documents.provider';

@Injectable()
export class UmkmService {
  constructor(private readonly loadDocumentsProvider: LoadDocumentsProvider) {}

  getJson() {
    return this.loadDocumentsProvider.loadJson();
  }
}
