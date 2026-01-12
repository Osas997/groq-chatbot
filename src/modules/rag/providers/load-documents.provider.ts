import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Document } from '@langchain/core/documents';

@Injectable()
export class LoadDocumentsProvider {
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
              pageContent:
                `type: ringkasan_keseluruhan\n` +
                this.formatJSONtoText(data.ringkasan_keseluruhan),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'ringkasan_keseluruhan',
                category: 'overview',
              },
            }),
          );
        }

        if (data?.sentimen_per_kategori) {
          documents.push(
            new Document({
              pageContent:
                `type: sentimen_per_kategori\n` +
                this.formatJSONtoText(data.sentimen_per_kategori),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'sentimen_per_kategori',
                category: 'category_analysis',
              },
            }),
          );
        }

        if (data?.sentimen_per_brand) {
          for (const [brand, stats] of Object.entries(
            data.sentimen_per_brand,
          )) {
            documents.push(
              new Document({
                pageContent:
                  `type: sentimen_per_brand\nbrand: ${brand}\n` +
                  this.formatJSONtoText(stats),
                metadata: {
                  source: 'dataset_umkm.json',
                  type: 'sentimen_per_brand',
                  category: 'brand',
                  brand_name: brand,
                },
              }),
            );
          }
        }

        if (data?.engagement_per_sentimen) {
          documents.push(
            new Document({
              pageContent:
                `type: engagement_per_sentimen\n` +
                this.formatJSONtoText(data.engagement_per_sentimen),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'engagement_per_sentimen',
                category: 'engagement',
              },
            }),
          );
        }

        if (data?.faktor_positif_top10) {
          documents.push(
            new Document({
              pageContent:
                `type: faktor_positif_top10\n` +
                this.formatJSONtoText({
                  faktor_positif_top10: data.faktor_positif_top10,
                }),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'faktor_positif_top10',
                category: 'factors',
                sentiment: 'positif',
              },
            }),
          );
        }

        if (data?.faktor_negatif_top10) {
          documents.push(
            new Document({
              pageContent:
                `type: faktor_negatif_top10\n` +
                this.formatJSONtoText({
                  faktor_negatif_top10: data.faktor_negatif_top10,
                }),
              metadata: {
                source: 'dataset_umkm.json',
                type: 'faktor_negatif_top10',
                category: 'factors',
                sentiment: 'negatif',
              },
            }),
          );
        }

        // Fallback: if nothing matched, store entire object
        if (documents.length === 0) {
          const content = this.formatJSONtoText(jsonData);
          documents.push(
            new Document({
              pageContent: content,
              metadata: {
                source: 'dataset_umkm.json',
              },
            }),
          );
        }
      }

      console.log('Success load documents');

      return documents;
    } catch (error) {
      throw new Error('Failed to load document dataset');
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

  private formatJSONtoText(obj: any): string {
    // Convert JSON object to readable text
    let text = '';

    const formatPrimitive = (v: any) => {
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      if (typeof v === 'string') return v;
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      return JSON.stringify(v);
    };

    const formatArray = (key: string, arr: any[], prefix: string) => {
      if (arr.length === 0) {
        text += `${prefix}${key}: []\n`;
        return;
      }

      const isObjectArray = arr.every(
        (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
      );

      if (!isObjectArray) {
        text += `${prefix}${key}: ${arr.map(formatPrimitive).join(', ')}\n`;
        return;
      }

      text += `${prefix}${key}:\n`;
      for (const item of arr) {
        const entries = Object.entries(item);
        if (entries.length === 0) {
          text += `${prefix}  - {}\n`;
          continue;
        }
        const summary = entries
          .map(([k, v]) => `${k}: ${formatPrimitive(v)}`)
          .join(' | ');
        text += `${prefix}  - ${summary}\n`;
      }
    };

    const processObject = (item: any, prefix = '') => {
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            formatArray(key, value, prefix);
          } else {
            text += `${prefix}${key}:\n`;
            processObject(value, prefix + '  ');
          }
        } else {
          text += `${prefix}${key}: ${value}\n`;
        }
      }
    };

    processObject(obj);
    return text.trim();
  }
}
