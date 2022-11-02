import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';
import { WalletRepository } from 'src/repository/wallet.repository';

@Injectable({})
export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  async getWallet(userId: string) {
    const user = new User();
    user.id = userId;
    return await this.walletRepository.findBy({
      createdBy: user,
    });
  }

  async createWallet(userId: string, name: string, address: string) {
    const user = new User();
    user.id = userId;

    const isExisted = await this.walletRepository.findOne({
      where: { createdBy: user, address },
    });

    if (isExisted) {
      throw 'Duplicate wallet';
    }

    const wallet = new Wallet();
    wallet.address = address;
    wallet.createdBy = user;
    wallet.name = name;
    wallet.isActive = true;

    return await this.walletRepository.save(wallet);
  }
}
