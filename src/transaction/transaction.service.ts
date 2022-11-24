import { Injectable } from '@nestjs/common';
import { TransactionDetailRequestDto } from 'src/dto/transactionDetailRequest.dto';
import { Label } from 'src/entity/label.entity';
import { TransactionDetail } from 'src/entity/transactionDetail.entity';
import { TxLabels } from 'src/entity/txLabels.entity';
import { User } from 'src/entity/user.entity';
import {
  erc1155ToTxResponse,
  erc20ToTxResponse,
  erc721ToTxResponse,
} from 'src/helper/toTxResponse';
import { Erc1155TransactionRepository } from 'src/repository/erc1155Transaction.repository';
import { Erc20TransactionRepository } from 'src/repository/erc20Transaction.repository';
import { Erc721TransactionRepository } from 'src/repository/erc721Transaction.repository';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { TransactionDetailRepository } from 'src/repository/transactionDetail.repository';
import { TxLabelsRepository } from 'src/repository/txLabels.repository';

@Injectable({})
export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private erc20TransactionRepository: Erc20TransactionRepository,
    private erc721TransactionRepository: Erc721TransactionRepository,
    private erc1155TransactionRepository: Erc1155TransactionRepository,
    private transactionDetailRepository: TransactionDetailRepository,
    private txLabelsRepository: TxLabelsRepository,
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
              .findOneByHash(i.hash, userId)
              .then(async (erc20) => {
                const labels =
                  await this.txLabelsRepository.findByTxHashAndUserId(
                    erc20.hash,
                    userId,
                  );
                return erc20ToTxResponse({ ...erc20, labels });
              });
          case 'ERC721':
            return this.erc721TransactionRepository
              .findOneByHash(i.hash, userId)
              .then(async (erc721) => {
                const labels =
                  await this.txLabelsRepository.findByTxHashAndUserId(
                    erc721.hash,
                    userId,
                  );
                return erc721ToTxResponse({ ...erc721, labels });
              });
          case 'ERC1155':
            return this.erc1155TransactionRepository
              .findOneByHash(i.hash, userId)
              .then(async (erc1155) => {
                const labels =
                  await this.txLabelsRepository.findByTxHashAndUserId(
                    erc1155.hash,
                    userId,
                  );
                return erc1155ToTxResponse({ ...erc1155, labels });
              });
          case 'NORMAL':
            return this.transactionRepository
              .getNormalTransactionWithRelationshipByHash(i.hash, userId)
              .then(async (j) => {
                const labels =
                  await this.txLabelsRepository.findByTxHashAndUserId(
                    i.hash,
                    userId,
                  );
                return {
                  ...j,
                  owner: j.ownerName,
                  labels: labels,

                  rate: 1234,
                  tx_actions: null,
                  contact_name: j.contactName,
                };
              });
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

  async addMemo(req: TransactionDetailRequestDto, userId: string) {
    const user = new User();
    user.id = userId;

    let txDetail = await this.transactionDetailRepository.findOne({
      where: [{ createdBy: user, txHash: req.txHash }],
    });
    if (!txDetail) {
      txDetail = new TransactionDetail();
      txDetail.txHash = req.txHash;
      txDetail.createdBy = user;
    }
    txDetail.memo = req.memo || '';
    return await this.transactionDetailRepository.save(txDetail);
  }

  async addLabel(req: TransactionDetailRequestDto, userId: string) {
    const user = new User();
    user.id = userId;

    let txDetail = await this.transactionDetailRepository.findOne({
      where: [{ createdBy: user, txHash: req.txHash }],
    });

    if (!txDetail) {
      txDetail = new TransactionDetail();
      txDetail.txHash = req.txHash;
      txDetail.createdBy = user;
    }
    if (req.txLabels)
      txDetail.txLabels = req.txLabels.map((labelId) => {
        const label = new Label();
        label.id = labelId;

        const txLabel = new TxLabels();
        txLabel.label = label;
        txLabel.createdBy = user;
        txLabel.transactionDetail = txDetail;

        return txLabel;
      });

    return await this.transactionDetailRepository.save(txDetail);
  }

  async createTransactionDetail(
    req: TransactionDetailRequestDto,
    userId: string,
  ) {
    const user = new User();
    user.id = userId;

    let txDetail = await this.transactionDetailRepository.findOne({
      where: [{ createdBy: user, txHash: req.txHash }],
    });

    if (!txDetail) {
      txDetail = new TransactionDetail();
      txDetail.txHash = req.txHash;
      txDetail.createdBy = user;
    }
    if (req.memo) txDetail.memo = req.memo || '';
    if (req.txLabels)
      txDetail.txLabels = req.txLabels.map((labelId) => {
        const label = new Label();
        label.id = labelId;

        const txLabel = new TxLabels();
        txLabel.label = label;
        txLabel.createdBy = user;
        txLabel.transactionDetail = txDetail;

        return txLabel;
      });

    return await this.transactionDetailRepository.save(txDetail);
  }
}
