import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseTransaction } from './baseTransaction';
import { TransactionDetail } from './transactionDetail.entity';

@Entity({ name: 'transaction' })
@ObjectType()
export class Transaction extends BaseTransaction {
  @Field()
  @PrimaryColumn()
  hash: string;

  @Field()
  @Column({ name: 'chain_id', nullable: false })
  chainId: string;

  @Field()
  @Column({ name: 'value', nullable: false })
  value: string;

  @Field()
  @Column({ name: 'is_error', nullable: false })
  isError: string;

  @Field()
  @Column({ name: 'method_id', nullable: false })
  methodId: string;

  @Field()
  @Column({ name: 'function_name', nullable: false })
  functionName: string;

  //
  @OneToMany(
    () => TransactionDetail,
    (transactionDetail) => transactionDetail.txHash,
  )
  transactionDetails: TransactionDetail[];
}
