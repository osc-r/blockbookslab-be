import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TxLabels } from './txLabels.entity';
import { User } from './user.entity';

@Entity({ name: 'label' })
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'is_active', nullable: false })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.labels)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_label_user_id',
  })
  createdBy: User;

  //
  @OneToMany(() => TxLabels, (txLabels) => txLabels.label)
  txLabels: TxLabels[];
}
