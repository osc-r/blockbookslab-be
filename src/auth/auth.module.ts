import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Wallet } from 'src/entity/wallet.entity';
import { BullModule } from '@nestjs/bull';
import { CryptoWalletRepository } from 'src/repository/cryptoWallet.repository';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction',
    }),
    TypeOrmModule.forFeature([User, Wallet]),
    JwtModule.register({
      secret: 'TEST',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, CryptoWalletRepository],
})
export class AuthModule {}
