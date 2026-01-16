import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class FileService {
  private readonly uploadPath = path.join(
    process.cwd(),
    'src',
    'common',
    'data',
    'json',
  );
  private readonly readFile = promisify(fs.readFile);
  private readonly writeFile = promisify(fs.writeFile);
  private readonly unlinkFile = promisify(fs.unlink);

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Save an image file to the uploads directory
   */
  async saveJson(
    file: Express.Multer.File,
    subFolder: string,
  ): Promise<string> {
    try {
      const folderPath = path.join(this.uploadPath, subFolder);

      // Create subfolder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Generate unique filename
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(folderPath, uniqueFileName);

      // Save the file
      await this.writeFile(filePath, file.buffer);

      return uniqueFileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Read an json file from the uploads directory
   */
  async readJson(
    fileName: string,
    subFolder: string = '',
  ): Promise<Buffer> {
    try {
      const filePath = path.join(this.uploadPath, subFolder, fileName);

      if (!fs.existsSync(filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      return await this.readFile(filePath);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to read json',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete an image file
   */
  async deleteJson(
    fileName: string,
    subFolder: string = '',
  ): Promise<void> {
    try {
      const filePath = path.join(this.uploadPath, subFolder, fileName);

      if (!fs.existsSync(filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      await this.unlinkFile(filePath);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete json',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get file path from filename
   */
  getFilePath(fileName: string, subFolder: string = 'images'): string {
    return path.join(this.uploadPath, subFolder, fileName);
  }

  /**
   * Check if file exists
   */
  async fileExists(
    fileName: string,
    subFolder: string = 'images',
  ): Promise<boolean> {
    const filePath = path.join(this.uploadPath, subFolder, fileName);
    return fs.existsSync(filePath);
  }

  /**
   * Get file stats (size, creation date, etc.)
   */
  async getFileStats(
    fileName: string,
    subFolder: string = 'images',
  ): Promise<fs.Stats> {
    try {
      const filePath = path.join(this.uploadPath, subFolder, fileName);
      return fs.promises.stat(filePath);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * List all files in a directory
   */
  async listFiles(subFolder: string = 'images'): Promise<string[]> {
    try {
      const folderPath = path.join(this.uploadPath, subFolder);

      if (!fs.existsSync(folderPath)) {
        return [];
      }

      return await fs.promises.readdir(folderPath);
    } catch (error) {
      throw new HttpException(
        'Failed to list files',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
