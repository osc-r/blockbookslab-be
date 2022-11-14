import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { TxLabels } from './txLabels.entity';
import { User } from './user.entity';

@Entity({ name: 'transaction_detail' })
export class TransactionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, name: 'tx_hash' })
  txHash: string;

  @Column({ nullable: false, default: '' })
  memo: string;

  @Column({ nullable: true, default: null })
  actionFunctionName: string;

  @Column({ nullable: true, default: null })
  actionContractName: string;

  @Column({ nullable: true, default: null })
  actionValue: string;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_transaction_detail_user_id',
  })
  createdBy: User;

  //
  @OneToMany('TxLabels', 'transactionDetail', {
    cascade: ['insert', 'update', 'remove'],
  })
  txLabels: TxLabels[];
}
