import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from 'src/entity/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet])],
  controllers: [WalletController],
  providers: [WalletService, UserRepository],
  exports: [UserRepository],
})
export class WalletModule {}
