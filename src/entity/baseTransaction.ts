import { Column } from 'typeorm';

export abstract class BaseTransaction {
  @Column({ name: 'from', nullable: false })
  from: string;

  @Column({ name: 'to', nullable: false })
  to: string;

  @Column({ name: 'contract_address', nullable: false })
  contractAddress: string;

  @Column({ name: 'gas', nullable: false })
  gas: string;

  @Column({ name: 'gas_price', nullable: false })
  gasPrice: string;

  @Column({ name: 'block_number', nullable: false })
  blockNumber: string;

  @Column({ name: 'time_stamp', nullable: false })
  timeStamp: string;

  @Column({ name: 'block_hash', nullable: false })
  blockHash: string;

  @Column({ name: 'nonce', nullable: false })
  nonce: string;

  @Column({ name: 'transaction_index', nullable: false })
  transactionIndex: string;

  @Column({ name: 'cumulative_gas_used', nullable: false })
  cumulativeGasUsed: string;

  @Column({ name: 'gas_used', nullable: false })
  gasUsed: string;

  @Column({ name: 'confirmations', nullable: false })
  confirmations: string;

  @Column({ name: 'input', nullable: false })
  input: string;
}
