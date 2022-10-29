import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/entity/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTxForActionGenerator(): Promise<
    { hash: string; from: string; to: string; functionName: string }[]
  > {
    return await this.query(
      `
      SELECT 
        t.hash, 
        t."from", 
        t."to", 
        t.function_name AS "functionName"
      FROM "transaction" t WHERE t.hash NOT IN(
          SELECT a.hash FROM (
            SELECT t.hash FROM "transaction" t INNER JOIN erc20_transaction et ON et.hash = t.hash
            UNION
            SELECT t.hash FROM "transaction" t INNER JOIN erc721_transaction et ON et.hash = t.hash
            UNION
            SELECT t.hash FROM "transaction" t INNER JOIN erc1155_transaction et ON et.hash = t.hash
      ) a) 
      AND t.value = '0' 
      AND t.is_error = '0' 
      AND t.function_name != ''`,
    );
  }
}
