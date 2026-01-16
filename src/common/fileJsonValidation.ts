import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

export interface JsonFileValidationOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedMimeTypes?: string[];
  requireJsonExtension?: boolean;
}

export const validateJsonFile = (
  file: Express.Multer.File,
  options: JsonFileValidationOptions = {},
): void => {
  const {
    maxSize = 1024 * 1024 * 5, // 5MB default
    allowedMimeTypes = [
      'application/json',
      'text/json',
      'application/octet-stream',
    ],
    requireJsonExtension = true,
  } = options;

  // Check if file exists
  if (!file) {
    throw new BadRequestException('File is required');
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new BadRequestException(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file extension
  const hasJsonExtension = file.originalname?.toLowerCase().endsWith('.json');

  if (requireJsonExtension && !hasJsonExtension) {
    throw new BadRequestException('File must have .json extension');
  }

  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype) && !hasJsonExtension) {
    throw new BadRequestException('Only JSON files are allowed');
  }
};
