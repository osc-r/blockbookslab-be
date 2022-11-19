import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';
import { CryptoWalletRepository } from 'src/repository/cryptoWallet.repository';
import { WalletRepository } from 'src/repository/wallet.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';

@Injectable({})
export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private cryptoWalletRepository: CryptoWalletRepository,
    @InjectQueue('transaction') private readonly transactionQueue: Queue,
  ) {}

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

    const walletResult = await this.walletRepository.save(wallet);

    const isSynced = await this.cryptoWalletRepository.findOneBy({
      address,
      chainId: '1',
    });

    const response = {
      ...walletResult,
      isSynced: true,
      jobId: null,
    };

    if (!isSynced) {
      const jobId = randomUUID();
      this.transactionQueue.add('transcode', { address }, { jobId });

      response.isSynced = false;
      response.jobId = jobId;
    }

    return response;
  }
}
