import {Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { AbsaService } from './providers/absa.service';

@Controller('absa')
export class AbsaController {
  constructor(private readonly absaService: AbsaService) {}

  @Post(":scraperId")
  async create(@Param("scraperId", new ParseUUIDPipe()) scraperId: string) {
    return this.absaService.create(scraperId);
  }
}
