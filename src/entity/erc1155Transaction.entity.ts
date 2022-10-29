import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTransaction } from './baseTransaction';

@Entity({ name: 'erc1155_transaction' })
export class Erc1155Transaction extends BaseTransaction {
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

  @Column({ name: 'token_value', nullable: false })
  tokenValue: string;
}
