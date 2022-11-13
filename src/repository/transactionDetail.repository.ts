import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TransactionDetail } from 'src/entity/transactionDetail.entity';

@Injectable()
export class TransactionDetailRepository extends Repository<TransactionDetail> {
  constructor(private dataSource: DataSource) {
    super(TransactionDetail, dataSource.createEntityManager());
  }
}
