import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTransaction } from './baseTransaction';

@Entity({ name: 'erc721_transaction' })
export class Erc721Transaction extends BaseTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hash', nullable: false })
  hash: string;

  @Column({ name: 'token_id', nullable: false })
  tokenID: string;

  @Column({ name: 'token_name', nullable: false })
  tokenName: string;

  @Column({ name: 'token_symbol', nullable: false })
  tokenSymbol: string;

  @Column({ name: 'token_decimal', nullable: false })
  tokenDecimal: string;
}
