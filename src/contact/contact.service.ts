import { Injectable } from '@nestjs/common';
import { Contact } from 'src/entity/contact.entity';
import { User } from 'src/entity/user.entity';
import { ContactRepository } from 'src/repository/contact.repository';

@Injectable({})
export class ContactService {
  constructor(private contactRepository: ContactRepository) {}

  async getContact(userId: string) {
    const user = new User();
    user.id = userId;
    return await this.contactRepository.findBy({
      createdBy: user,
    });
  }

  async createContact(userId: string, name: string, address: string) {
    const user = new User();
    user.id = userId;

    let contact = await this.contactRepository.findOne({
      where: { createdBy: user, address },
    });

    if (contact) {
      contact.name = name;
    } else {
      contact = new Contact();
      contact.address = address;
      contact.name = name;
      contact.createdBy = user;
    }

    return await this.contactRepository.save(contact);
  }
}
