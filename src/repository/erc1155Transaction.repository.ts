import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc1155Transaction } from 'src/entity/erc1155Transaction.entity';

@Injectable()
export class Erc1155TransactionRepository extends Repository<Erc1155Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc1155Transaction, dataSource.createEntityManager());
  }
}
