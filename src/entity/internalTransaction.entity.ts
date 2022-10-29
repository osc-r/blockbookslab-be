import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'internal_transaction' })
export class InternalTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from', nullable: false })
  from: string;

  @Column({ name: 'to', nullable: false })
  to: string;

  @Column({ name: 'contract_address', nullable: false })
  contractAddress: string;

  @Column({ name: 'value', nullable: false })
  value: string;

  @Column({ name: 'input', nullable: false })
  input: string;

  @Column({ name: 'gas', nullable: false })
  gas: string;

  @Column({ name: 'gas_used', nullable: false })
  gasUsed: string;

  @Column({ name: 'block_number', nullable: false })
  blockNumber: string;

  @Column({ name: 'time_stamp', nullable: false })
  timeStamp: string;

  @Column({ name: 'type', nullable: false })
  type: string;

  @Column({ name: 'is_error', nullable: false })
  isError: string;

  @Column({ name: 'err_code', nullable: false })
  errCode: string;
}
