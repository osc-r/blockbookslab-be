import { Entity, Column, PrimaryColumn } from 'typeorm';

import { BaseTransaction } from './baseTransaction';

@Entity({ name: 'transaction' })
export class Transaction extends BaseTransaction {
  @PrimaryColumn()
  hash: string;

  @Column({ name: 'from', nullable: false })
  from: string;

  @Column({ name: 'to', nullable: false })
  to: string;

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

  @Column({ name: 'block_number', nullable: false })
  blockNumber: string;
}
