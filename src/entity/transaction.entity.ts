import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { BaseTransaction } from './baseTransaction';
import { TransactionDetail } from './transactionDetail.entity';

@Entity({ name: 'transaction' })
export class Transaction extends BaseTransaction {
  @PrimaryColumn()
  hash: string;

  @Column({ name: 'chain_id', nullable: false })
  chainId: string;

  @Column({ name: 'value', nullable: false })
  value: string;

  @Column({ name: 'is_error', nullable: false })
  isError: string;

  @Column({ name: 'method_id', nullable: false })
  methodId: string;

  @Column({ name: 'function_name', nullable: false })
  functionName: string;
}
