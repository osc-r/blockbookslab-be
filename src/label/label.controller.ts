import { Controller, Get, Post, Req } from '@nestjs/common';
import { LabelService } from './label.service';

@Controller('labels')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Get()
  async getContact(@Req() req) {
    return await this.labelService.getLabel(req.user.userId);
  }

  @Post()
  async postContact(@Req() req) {
    return await this.labelService.createLabel(req.user.userId, req.body.name);
  }
}
