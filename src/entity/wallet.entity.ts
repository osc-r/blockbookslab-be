import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'wallet' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_wallet_user_id',
  })
  createdBy: User;

  //chainId
  //lastBlockHeight
}
