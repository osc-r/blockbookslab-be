import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc20Transaction } from 'src/entity/erc20Transaction.entity';

@Injectable()
export class Erc20TransactionRepository extends Repository<Erc20Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc20Transaction, dataSource.createEntityManager());
  }
}
