import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'contact' })
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_contact_user_id',
  })
  createdBy: User;
}
