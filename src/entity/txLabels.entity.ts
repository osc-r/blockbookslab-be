import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Label } from './label.entity';
import { TransactionDetail } from './transactionDetail.entity';
import { User } from './user.entity';

@Entity({ name: 'tx_labels' })
export class TxLabels {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => TransactionDetail,
    (transactionDetail) => transactionDetail.txLabels,
    { orphanedRowAction: 'delete' },
  )
  @JoinColumn({
    name: 'transaction_detail_id',
    foreignKeyConstraintName: 'fk_tx_labels_transaction_detail_id',
  })
  transactionDetail: TransactionDetail;

  @ManyToOne(() => Label, (label) => label.txLabels)
  @JoinColumn({
    name: 'label_id',
    foreignKeyConstraintName: 'fk_tx_labels_label_id',
  })
  label: Label;

  @ManyToOne(() => User, (user) => user.txLabels)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_tx_labels_user_id',
  })
  createdBy: User;
}
