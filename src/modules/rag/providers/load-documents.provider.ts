import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Document } from '@langchain/core/documents';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoadDocumentsProvider {
  private readonly logger = new Logger(LoadDocumentsProvider.name);

  async loadDocuments() {
    try {
      const jsonData = this.loadJson();
      const documents: Document[] = [];

      // Convert JSON data to documents
      if (Array.isArray(jsonData)) {
        jsonData.forEach((item, index) => {
          const content = this.formatJSONtoText(item);
          documents.push(
            new Document({
              pageContent: content,
              metadata: {
                source: 'dataset_umkm.json',
                index: index,
                scope: 'global',
              },
            }),
          );
        });
      } else {
        // Semantic chunking per category for a single object dataset
        const data = jsonData as any;

        if (data?.ringkasan_keseluruhan) {
          documents.push(
            new Document({
              pageContent: this.formatOverview(data.ringkasan_keseluruhan),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'ringkasan_keseluruhan',
                category: 'overview',
                scope: 'global',
              },
            }),
          );
        }

        if (data?.sentimen_per_kategori) {
          documents.push(
            new Document({
              pageContent: this.formatCategorySentiment(data.sentimen_per_kategori),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'sentimen_per_kategori',
                category: 'category_analysis',
                scope: 'global',
              },
            }),
          );
        }

        if (data?.sentimen_per_brand) {
          let combinedBrandText = 'Analisis Sentimen Seluruh Brand:\n\n';
          for (const [brand, stats] of Object.entries(data.sentimen_per_brand)) {
             combinedBrandText += this.formatBrandAnalysis(brand, stats) + '\n---\n';
          }

          documents.push(
            new Document({
              pageContent: combinedBrandText,
              metadata: {
                source: 'dataset_umkm.json',
                type: 'sentimen_per_brand',
                category: 'brand',
                scope: 'global',
              },
            }),
          );
        }

        if (data?.engagement_per_sentimen) {
          documents.push(
            new Document({
              pageContent: this.formatEngagement(data.engagement_per_sentimen),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'engagement_per_sentimen',
                category: 'engagement',
                scope: 'global',
              },
            }),
          );
        }

        if (data?.faktor_positif_top10) {
          documents.push(
            new Document({
              pageContent: this.formatFactors('positif', data.faktor_positif_top10),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'faktor_positif_top10',
                category: 'factors',
                sentiment: 'positif',
                scope: 'global',
              },
            }),
          );
        }

        if (data?.faktor_negatif_top10) {
          documents.push(
            new Document({
              pageContent: this.formatFactors('negatif', data.faktor_negatif_top10),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'faktor_negatif_top10',
                category: 'factors',
                sentiment: 'negatif',
                scope: 'global',
              },
            }),
          );
        }

        // Fallback: if nothing matched, store entire object using generic formatter
        if (documents.length === 0) {
          const content = this.formatJSONtoText(jsonData);
          documents.push(
            new Document({
              pageContent: content,
              metadata: {
                source: 'dataset_umkm.json',
                scope: 'global',
              },
            }),
          );
        }
      }

      console.log('Success load documents');

      return documents;
    } catch (error) {
      console.error('Error loading documents:', error);
      throw new Error('Failed to load document dataset: ' + error.message);
    }
  }

  loadJson() {
    try {
      const filePath = path.join(
        process.cwd(),
        'src/common/data/json/dataset_umkm.json',
      );
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error) {
      throw new Error('Failed to load JSON file');
    }
  }

  private formatOverview(data: any): string {
    const total = data.Netral.jumlah + data.Positif.jumlah + data.Negatif.jumlah;
    return `
    Ringkasan Analisis Keseluruhan UMKM:
    Total data yang dianalisis mencakup ${total} interaksi / Mentions.
    Distribusi sentimen:
    - Positif: ${data.Positif.persentase}% (${data.Positif.jumlah} data)
    - Netral: ${data.Netral.persentase}% (${data.Netral.jumlah} data)
    - Negatif: ${data.Negatif.persentase}% (${data.Negatif.jumlah} data)
    
    Sentimen dominan adalah ${this.getDominantSentimentFromOverview(data)}.
    `.trim();
  }

  private formatCategorySentiment(data: any): string {
    let text = 'Analisis Sentimen per Kategori Produk:\n';
    
    // Structure: key=CategoryName, value={ positif, negatif, netral, total, rasio_positif }
    for (const [category, stats] of Object.entries(data)) {
        const s = stats as any;
        text += `- Kategori ${category}: Memiliki total ${s.total} ulasan. Sentimen positif ${s.positif}, netral ${s.netral}, dan negatif ${s.negatif}. Rasio positif: ${s.rasio_positif}%.\n`;
        // Check for high negative ratio (e.g., > 10% or just absolute number comparison)
        const negativeRatio = (s.negatif / s.total) * 100;
        if (negativeRatio > 5) {
            text += `  (Catatan: Perlu perhatian karena rasio negatif mencapai ${negativeRatio.toFixed(1)}%).\n`;
        }
    }
    return text;
  }

  private formatBrandAnalysis(brand: string, stats: any): string {
    // Structure: { positif, negatif, netral, total, rasio_positif, rasio_negatif, rasio_netral }
    return `
    Analisis Brand ${brand}:
    Brand ini memiliki total penyebutan sebanyak ${stats.total}.
    Profil sentimen brand ini adalah:
    - Positif: ${stats.positif} (${stats.rasio_positif}%)
    - Netral: ${stats.netral} (${stats.rasio_netral}%)
    - Negatif: ${stats.negatif} (${stats.rasio_negatif}%)
    
    ${stats.positif > stats.negatif * 2 ? 
        'Brand ini memiliki citra yang cukup kuat.' : 
        'Brand ini menghadapi tantangan sentimen.'}
    `.trim();
  }

  private formatEngagement(data: any): string {
    // Structure: { Negatif: { avg_engagement, avg_likes, avg_shares }, Netral: ..., Positif: ... }
    return `
    Analisis Engagement (Interaksi Pengguna) Berdasarkan Sentimen:
    - Komentar Positif: Rata-rata engagement ${data.Positif.avg_engagement} (Likes: ${data.Positif.avg_likes}, Shares: ${data.Positif.avg_shares}).
    - Komentar Netral: Rata-rata engagement ${data.Netral.avg_engagement} (Likes: ${data.Netral.avg_likes}, Shares: ${data.Netral.avg_shares}).
    - Komentar Negatif: Rata-rata engagement ${data.Negatif.avg_engagement} (Likes: ${data.Negatif.avg_likes}, Shares: ${data.Negatif.avg_shares}).
    
    ${data.Negatif.avg_engagement > data.Positif.avg_engagement ? 
        'Terlihat bahwa komentar negatif cenderung memancing interaksi publik yang lebih tinggi.' : ''}
    `.trim();
  }

  private formatFactors(type: string, factors: any[]): string {
    const sentimentType = type.includes('positif') ? 'Positif' : 'Negatif';
    let text = `Faktor-faktor Utama Pendorong Sentimen ${sentimentType} (Top 10):\n`;
    
    // Structure: array of { kata, jumlah }
    factors.forEach((factor, idx) => {
        text += `${idx + 1}. Kata kunci "${factor.kata}": Muncul sebanyak ${factor.jumlah} kali.\n`;
    });
    return text;
  }

  private getDominantSentimentFromOverview(data: any): string {
    const pos = data.Positif.jumlah;
    const neu = data.Netral.jumlah;
    const neg = data.Negatif.jumlah;
    if (pos > neu && pos > neg) return 'Positif';
    if (neg > pos && neg > neu) return 'Negatif';
    return 'Netral';
  }

  // Legacy generic formatter kept as fallback or helper
  private formatJSONtoText(obj: any): string {
     return JSON.stringify(obj, null, 2); 
  }

  chunkingAbsa(userId: string, scraperId: string, data: { summary: any; sentiment_trend: any }){
    try {
      const documents: Document[] = [];

      // Semantic Chunk 1: Summary
      const summaryText = `
      Analisis Sentimen Ringkasan (Scraper ID: ${scraperId}):
      
      Persentase Sentimen:
      - Harga: Netral ${data.summary.percentage.price.neutral}%, Negatif ${data.summary.percentage.price.negative}%, Positif ${data.summary.percentage.price.positive}%
      - Layanan: Netral ${data.summary.percentage.service.neutral}%, Negatif ${data.summary.percentage.service.negative}%, Positif ${data.summary.percentage.service.positive}%
      - Kualitas Makanan: Netral ${data.summary.percentage.food_quality.neutral}%, Negatif ${data.summary.percentage.food_quality.negative}%, Positif ${data.summary.percentage.food_quality.positive}%

      Distribusi Komentar:
      - Harga: Netral ${data.summary.distribution.price.neutral}, Negatif ${data.summary.distribution.price.negative}, Positif ${data.summary.distribution.price.positive}
      - Layanan: Netral ${data.summary.distribution.service.neutral}, Negatif ${data.summary.distribution.service.negative}, Positif ${data.summary.distribution.service.positive}
      - Kualitas Makanan: Netral ${data.summary.distribution.food_quality.neutral}, Negatif ${data.summary.distribution.food_quality.negative}, Positif ${data.summary.distribution.food_quality.positive}

      Sentimen Keseluruhan: Netral ${data.summary.overall_sentiment.neutral}, Negatif ${data.summary.overall_sentiment.negative}, Positif ${data.summary.overall_sentiment.positive}
      
      Analisis Relevansi:
      - Komentar Relevan: ${data.summary.relevance_analysis.relevant_comments} (${data.summary.relevance_analysis.relevant_ratio_percent}%)
      - Komentar Tidak Relevan: ${data.summary.relevance_analysis.non_relevant_comments} (${data.summary.relevance_analysis.non_relevant_ratio_percent}%)
      `.trim();

      documents.push({
        pageContent: summaryText,
        metadata: { userId, scraperId, type: 'absa_summary' },
      });

      // Semantic Chunk 2: Sentiment Trend
      let trendText = `Tren Sentimen (Scraper ID: ${scraperId}) (Granularity: ${data.sentiment_trend.granularity}):\n`;
      for (const trend of data.sentiment_trend.trend) {
        trendText += `- Tanggal ${trend.date}: Netral ${trend.neutral}, Negatif ${trend.negative}, Positif ${trend.positive}\n`;
      }
      
      documents.push({
        pageContent: trendText.trim(),
        metadata: { userId, scraperId, type: 'absa_trend' },
      });

    return documents;
    } catch (error) {
      this.logger.error('Error ingesting ABSA data:', error);
      throw new HttpException(
        'Failed to ingest ABSA data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
