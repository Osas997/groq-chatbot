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
                ...item,
              },
            }),
          );
        });
      } else {
        // If it's a single object
        const content = this.formatJSONtoText(jsonData);
        documents.push(
          new Document({
            pageContent: content,
            metadata: {
              source: 'dataset_umkm.json',
              ...jsonData,
            },
          }),
        );
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

    const processObject = (item: any, prefix = '') => {
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            text += `${prefix}${key}: ${value.join(', ')}\n`;
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
