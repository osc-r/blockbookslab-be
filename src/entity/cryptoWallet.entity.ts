import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'crypto_wallet' })
export class CryptoWallet {
  @PrimaryColumn()
  address: string;

  @PrimaryColumn()
  chainId: string;

  @Column({ nullable: false })
  latestBlock: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
