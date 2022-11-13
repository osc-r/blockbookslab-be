import { Injectable } from '@nestjs/common';
import {
  erc1155ToTxResponse,
  erc20ToTxResponse,
  erc721ToTxResponse,
} from 'src/helper/toTxResponse';
import { Erc1155TransactionRepository } from 'src/repository/erc1155Transaction.repository';
import { Erc20TransactionRepository } from 'src/repository/erc20Transaction.repository';
import { Erc721TransactionRepository } from 'src/repository/erc721Transaction.repository';
import { TransactionRepository } from 'src/repository/transaction.repository';

@Injectable({})
export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private erc20TransactionRepository: Erc20TransactionRepository,
    private erc721TransactionRepository: Erc721TransactionRepository,
    private erc1155TransactionRepository: Erc1155TransactionRepository,
  ) {}

  async getTransaction(
    userId: string,
    options: { current: string; limit: string },
  ) {
    try {
      if (!options.current) options.current = '0';
      if (!options.limit) options.limit = '30';

      const result = await this.transactionRepository.getTransactions(
        userId,
        options,
      );

      const txList = result.txList.map((i) => {
        switch (i.type) {
          case 'ERC20':
            return this.erc20TransactionRepository
              .findOneByHash(i.hash)
              .then((erc20) => erc20ToTxResponse(erc20));
          case 'ERC721':
            return this.erc721TransactionRepository
              .findOneByHash(i.hash)
              .then((erc721) => erc721ToTxResponse(erc721));
          case 'ERC1155':
            return this.erc1155TransactionRepository
              .findOneByHash(i.hash)
              .then((erc1155) => erc1155ToTxResponse(erc1155));
          case 'NORMAL':
            return this.transactionRepository
              .getNormalTransactionWithRelationshipByHash(i.hash)
              .then((j) => ({
                ...j,
                owner: 'walletName',

                rate: 1234,
                tx_actions: null,
                labels: [],
                contact_name: null,
              }));
        }
      });

      const response = {
        txList: await Promise.all(txList),
        pagination: {
          current: parseInt(options.current),
          totalItem: result.totalItem,
          limit: parseInt(options.limit),
        },
      };

      return response;
    } catch (error) {
      console.log({ error });
      return error;
    }
  }
}
