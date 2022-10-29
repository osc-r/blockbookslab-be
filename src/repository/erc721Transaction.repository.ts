import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc721Transaction } from 'src/entity/erc721Transaction.entity';

@Injectable()
export class Erc721TransactionRepository extends Repository<Erc721Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc721Transaction, dataSource.createEntityManager());
  }
}
