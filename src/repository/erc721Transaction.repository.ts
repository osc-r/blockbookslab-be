import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc721Transaction } from 'src/entity/erc721Transaction.entity';

@Injectable()
export class Erc721TransactionRepository extends Repository<Erc721Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc721Transaction, dataSource.createEntityManager());
  }

  async findOneByHash(hash: string, userId: string) {
    const [tx]: Erc721Transaction[] = await this.dataSource.query(
      `
    SELECT et.*, td.id AS "transactionDetailId", td.memo AS "memo", w."name" AS "ownerName" FROM erc721_transaction et 
      LEFT JOIN transaction_detail td ON td.tx_hash = et.hash
      LEFT JOIN wallet w ON w.address = et."from" OR w.address = et."to"
      WHERE et.hash = $1 AND w.created_by = $2
      `,
      [hash, userId],
    );

    return tx as {
      transactionDetailId: string;
      memo: string;
      ownerName: string;
    } & Erc721Transaction;
  }
}
