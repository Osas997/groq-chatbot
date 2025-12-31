import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scraping')
@Controller('scraping')
export class ScrapingController {}
