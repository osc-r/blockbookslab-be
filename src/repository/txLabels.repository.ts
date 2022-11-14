import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TxLabels } from 'src/entity/txLabels.entity';

@Injectable()
export class TxLabelsRepository extends Repository<TxLabels> {
  constructor(private dataSource: DataSource) {
    super(TxLabels, dataSource.createEntityManager());
  }

  async findByTxHashAndUserId(txHash: string, userId: string) {
    const q = `
    SELECT l."id", l."name"
    FROM tx_labels t 
    INNER JOIN "label" l ON l.id = t.label_id
    INNER JOIN transaction_detail td ON t.transaction_detail_id = td.id
    WHERE td.tx_hash = $1 AND td.created_by = $2;
    `;
    return await this.dataSource.query(q, [txHash, userId]);
  }
}
