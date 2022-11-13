import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Erc1155Transaction } from 'src/entity/erc1155Transaction.entity';

@Injectable()
export class Erc1155TransactionRepository extends Repository<Erc1155Transaction> {
  constructor(private dataSource: DataSource) {
    super(Erc1155Transaction, dataSource.createEntityManager());
  }

  async findOneByHash(hash: string, userId: string) {
    const [tx]: Erc1155Transaction[] = await this.dataSource.query(
      `
    SELECT et.*, td.id AS "transactionDetailId", td.memo AS "memo", w."name" AS "ownerName" FROM erc1155_transaction et 
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
    } & Erc1155Transaction;
  }
}
