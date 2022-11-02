import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from 'src/entity/wallet.entity';
import { WalletRepository } from 'src/repository/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletRepository],
})
export class WalletModule {}
