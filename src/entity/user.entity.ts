import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';
import { Label } from './label.entity';
import { TxLabels } from './txLabels.entity';
import { Wallet } from './wallet.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  address: string;

  //
  @OneToMany(() => Wallet, (wallet) => wallet.createdBy)
  wallets: Wallet[];

  @OneToMany(() => Contact, (contact) => contact.createdBy)
  contacts: Contact[];

  @OneToMany(() => Label, (label) => label.createdBy)
  labels: Label[];

  @OneToMany(() => TxLabels, (txLabel) => txLabel.createdBy)
  txLabels: TxLabels[];
}
