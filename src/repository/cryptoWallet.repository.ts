import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CryptoWallet } from 'src/entity/cryptoWallet.entity';

@Injectable()
export class CryptoWalletRepository extends Repository<CryptoWallet> {
  constructor(private dataSource: DataSource) {
    super(CryptoWallet, dataSource.createEntityManager());
  }
}
