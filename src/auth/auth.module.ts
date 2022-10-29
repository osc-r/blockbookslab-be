import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Wallet } from 'src/entity/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    JwtModule.register({
      secret: 'TEST',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [UserRepository],
})
export class AuthModule {}
