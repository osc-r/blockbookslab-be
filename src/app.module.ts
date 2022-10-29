import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './entity/user.entity';
import { Wallet } from './entity/wallet.entity';
import { Contact } from './entity/contact.entity';
import { Label } from './entity/label.entity';
import { TransactionDetail } from './entity/transactionDetail.entity';
import { TxLabels } from './entity/txLabels.entity';
import { JwtStrategy } from './helper/jwt.strategy';
import { JwtAuthGuard } from './helper/jwt-auth.guard';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';
import { Transaction } from './entity/transaction.entity';
import { Erc721Transaction } from './entity/erc721Transaction.entity';
import { Erc20Transaction } from './entity/erc20Transaction.entity';
import { Erc1155Transaction } from './entity/erc1155Transaction.entity';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        entities: [
          User,
          Wallet,
          Contact,
          Label,
          TransactionDetail,
          TxLabels,
          Transaction,
          Erc721Transaction,
          Erc20Transaction,
          Erc1155Transaction,
        ],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TransactionModule,
    WalletModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
