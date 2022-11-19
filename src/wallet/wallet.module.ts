import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from 'src/entity/wallet.entity';
import { WalletRepository } from 'src/repository/wallet.repository';
import { BullModule } from '@nestjs/bull';
import { CryptoWalletRepository } from 'src/repository/cryptoWallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository, CryptoWalletRepository],
})
export class WalletModule {}
