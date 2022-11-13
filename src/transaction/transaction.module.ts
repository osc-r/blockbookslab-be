import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDetail } from 'src/entity/transactionDetail.entity';
import { Erc1155TransactionRepository } from 'src/repository/erc1155Transaction.repository';
import { Erc20TransactionRepository } from 'src/repository/erc20Transaction.repository';
import { Erc721TransactionRepository } from 'src/repository/erc721Transaction.repository';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { TransactionDetailRepository } from 'src/repository/transactionDetail.repository';
import { TransactionController } from './transaction.controller';
import { TransactionProcessor } from './transaction.processor';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction',
    }),
    HttpModule,
    TypeOrmModule.forFeature([TransactionDetail]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionProcessor,
    TransactionRepository,
    Erc20TransactionRepository,
    Erc721TransactionRepository,
    Erc1155TransactionRepository,
    TransactionDetailRepository,
    TransactionService,
  ],
})
export class TransactionModule {}
