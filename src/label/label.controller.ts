import { Controller, Get, Post, Req } from '@nestjs/common';
import { LabelService } from './label.service';

@Controller('labels')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Get()
  async getLabel(@Req() req) {
    return await this.labelService.getLabel(req.user.userId);
  }

  @Post()
  async postLabel(@Req() req) {
    return await this.labelService.createLabel(req.user.userId, req.body.name);
  }
}
