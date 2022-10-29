import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { TxLabels } from './txLabels.entity';
import { User } from './user.entity';

@Entity({ name: 'transaction_detail' })
export class TransactionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionDetails)
  @JoinColumn({
    name: 'tx_hash',
    foreignKeyConstraintName: 'fk_transaction_detail_transaction_hash',
  })
  txHash: Transaction;

  @Column({ nullable: false, default: '' })
  memo: string;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_transaction_detail_user_id',
  })
  createdBy: User;

  //
  @OneToMany(() => TxLabels, (txLabel) => txLabel.transactionDetail)
  txLabels: TxLabels[];
}
