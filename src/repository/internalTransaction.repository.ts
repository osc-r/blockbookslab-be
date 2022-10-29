import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InternalTransaction } from 'src/entity/internalTransaction.entity';

@Injectable()
export class InternalTransactionRepository extends Repository<InternalTransaction> {
  constructor(private dataSource: DataSource) {
    super(InternalTransaction, dataSource.createEntityManager());
  }
}
