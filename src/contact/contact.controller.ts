import { Controller, Get, Post, Req } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async getContact(@Req() req) {
    return await this.contactService.getContact(req.user.userId);
  }

  @Post()
  async postContact(@Req() req) {
    return await this.contactService.createContact(
      req.user.userId,
      req.body.name,
      req.body.address,
    );
  }
}
