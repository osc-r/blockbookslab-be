import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseTransaction } from './baseTransaction';

@Entity({ name: 'erc20_transaction' })
export class Erc20Transaction extends BaseTransaction {
  @PrimaryColumn({ name: 'from', nullable: false })
  from: string;

  @PrimaryColumn({ name: 'to', nullable: false })
  to: string;

  @PrimaryColumn({ name: 'hash', nullable: false })
  hash: string;

  @Column({ name: 'token_name', nullable: false })
  tokenName: string;

  @Column({ name: 'token_symbol', nullable: false })
  tokenSymbol: string;

  @Column({ name: 'token_decimal', nullable: false })
  tokenDecimal: string;

  @Column({ name: 'value', nullable: false })
  value: string;

  @Column({ name: 'block_number', nullable: false })
  blockNumber: string;
}
