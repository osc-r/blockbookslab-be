import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Wallet } from 'src/entity/wallet.entity';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(private dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }
}
