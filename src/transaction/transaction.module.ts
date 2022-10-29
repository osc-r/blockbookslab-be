import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Erc1155TransactionRepository } from 'src/repository/erc1155Transaction.repository';
import { Erc20TransactionRepository } from 'src/repository/erc20Transaction.repository';
import { Erc721TransactionRepository } from 'src/repository/erc721Transaction.repository';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { TransactionController } from './transaction.controller';
import { TransactionProcessor } from './transaction.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction',
    }),
    HttpModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionProcessor,
    TransactionRepository,
    Erc20TransactionRepository,
    Erc721TransactionRepository,
    Erc1155TransactionRepository,
  ],
})
export class TransactionModule {}
