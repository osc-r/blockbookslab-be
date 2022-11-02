import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Contact } from 'src/entity/contact.entity';

@Injectable()
export class ContactRepository extends Repository<Contact> {
  constructor(private dataSource: DataSource) {
    super(Contact, dataSource.createEntityManager());
  }
}
