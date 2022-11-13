import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc20Transaction } from 'src/entity/erc20Transaction.entity';

@Injectable()
export class Erc20TransactionRepository extends Repository<Erc20Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc20Transaction, dataSource.createEntityManager());
  }

  async findOneByHash(hash: string) {
    const [tx]: Erc20Transaction[] = await this.dataSource.query(
      `
    SELECT et.*, td.id AS "transactionDetailId", td.memo AS "memo", w."name" AS "ownerName" FROM erc20_transaction et 
      LEFT JOIN transaction_detail td ON td.tx_hash = et.hash
      LEFT JOIN wallet w ON w.address = et."from" OR w.address = et."to"
      WHERE et.hash = $1
      `,
      [hash],
    );

    return tx as {
      transactionDetailId: string;
      memo: string;
      ownerName: string;
    } & Erc20Transaction;
  }
}
