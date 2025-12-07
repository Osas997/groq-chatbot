import {
  Injectable,
  OnModuleInit,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getGroqConfig } from 'src/config/groq.config';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PromptInsightsProvider } from './prompt-insights.provider';
import { LoadDocumentsProvider } from './load-documents.provider';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);
  private vectorStore: PGVectorStore;
  private llm: ChatGroq;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private chain: RunnableSequence;
  private pool: Pool;

  constructor(
    private readonly configService: ConfigService,
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

      // Initialize PostgreSQL pool for PGVector using DATABASE_* env
      this.pool = new Pool({
        host: this.configService.get('database.host'),
        port: this.configService.get('database.port'),
        user: this.configService.get('database.username'),
        password: this.configService.get('database.password'),
        database: this.configService.get('database.database'),
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

    const schema = this.configService.get('DATABASE_SCHEMA') || 'public';
    const table =
      this.configService.get('DATABASE_TABLE_NAME') || 'langchain_documents';
    const qualifiedForStore = `${schema}.${table}`;
    const qualifiedForSql = `"${schema}"."${table}"`;

    let existingCount = 0;
    try {
      const result = await this.pool.query(
        `SELECT COUNT(1) AS count FROM ${qualifiedForSql}`,
      );
      existingCount = parseInt(result.rows?.[0]?.count || '0', 10);
    } catch (e) {
      existingCount = 0;
    }

    if (existingCount > 0) {
      this.vectorStore = new PGVectorStore(this.embeddings, {
        pool: this.pool,
        tableName: qualifiedForStore,
      });
      this.logger.log(
        `Using existing vector store data from ${qualifiedForStore} (rows: ${existingCount})`,
      );
    } else {
      // Insert new vectors
      this.vectorStore = await PGVectorStore.fromDocuments(
        splitDocs,
        this.embeddings,
        {
          pool: this.pool,
          tableName: qualifiedForStore,
        },
      );
      this.logger.log(
        `Inserted ${splitDocs.length} chunks into ${qualifiedForStore}`,
      );
    }

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
