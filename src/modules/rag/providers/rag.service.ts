import {
  Injectable,
  OnModuleInit,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getGroqConfig } from 'src/config/groq.config';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PromptInsightsProvider } from './prompt-insights.provider';
import { LoadDocumentsProvider } from './load-documents.provider';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);
  private vectorStore: MemoryVectorStore;
  private llm: ChatGroq;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private chain: RunnableSequence;

  constructor(
    private readonly promptInsightsProvider: PromptInsightsProvider,
    private readonly loadDocumentsProvider: LoadDocumentsProvider,
  ) {}

  async onModuleInit() {
    try {
      const groqConfig = getGroqConfig();
      this.llm = new ChatGroq({
        apiKey: groqConfig.apiKey,
        model: groqConfig.model,
        temperature: 0.7,
        maxTokens: 8192,
      });

      // Initialize embeddings
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: 'text-embedding-004',
      });

      await this.initializeRAG();
      this.logger.log('RAG system initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize RAG system:', error);
      throw error;
    }
  }

  private async initializeRAG() {
    // Load and process documents
    const documents = await this.loadDocumentsProvider.loadDocuments();

    // Split documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '.', '!', '?', ';', ',', ' ', ''],
    });

    const splitDocs = await textSplitter.splitDocuments(documents);
    this.logger.log(`Created ${splitDocs.length} document chunks`);

    // Create vector store
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      this.embeddings,
    );

    // Create RAG chain
    await this.createRAGChain();
  }

  private async createRAGChain() {
    const prompt = PromptTemplate.fromTemplate(
      `Namamu adalah Sentinela.
        Kamu adalah asisten RAG yang hanya boleh menjawab berdasarkan konteks berikut.

        Konteks:
        {context}

        Pertanyaan: {question}

        Jawaban:`,
    );

    this.chain = RunnableSequence.from([
      {
        context: async (input: { question: string }) => {
          const retriever = this.vectorStore.asRetriever({
            k: 5, // Return top 5 relevant documents
            searchType: 'similarity',
          });

          const relevantDocs = await retriever.invoke(input.question);
          return relevantDocs.map((doc) => doc.pageContent).join('\n\n');
        },
        question: (input: { question: string }) => input.question,
      },
      prompt,
      this.llm,
      new StringOutputParser(),
    ]);
  }

  async queryRAG(question: string): Promise<string> {
    try {
      if (!this.chain) {
        throw new Error('RAG chain not initialized');
      }

      const response = await this.chain.invoke({ question });

      return response;
    } catch (error) {
      this.logger.error('Error in RAG query:', error);
      throw new HttpException(
        {
          message: 'Failed to process your question',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInsights(): Promise<any> {
    try {
      const prompt = this.promptInsightsProvider.prompt();

      const result = await this.queryRAG(prompt);
      return result;
    } catch (error) {
      this.logger.error('Error getting insights:', error);
      throw new HttpException(
        {
          message: 'Failed to generate insights',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
