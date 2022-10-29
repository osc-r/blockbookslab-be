import { DataSource, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Wallet } from 'src/entity/wallet.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByAddress(address: string): Promise<User> {
    return await this.createQueryBuilder()
      .where(`User.address = :address`, { address })
      .getOne();
  }

  async createNewUser(address: string): Promise<User | null> {
    let user: User;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newUser = new User();
      newUser.address = address;
      user = await queryRunner.manager.save(newUser);

      const newWallet = new Wallet();
      newWallet.name = 'default_wallet';
      newWallet.address = address;
      newWallet.createdBy = user;
      await queryRunner.manager.save(newWallet);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create new user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
      return user;
    }
  }
}
