import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DoneCallback, Job } from 'bull';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { Transaction } from 'src/entity/transaction.entity';
import { Erc20TransactionRepository } from 'src/repository/erc20Transaction.repository';
import { BaseTransaction } from 'src/entity/baseTransaction';
import { Erc20Transaction } from 'src/entity/erc20Transaction.entity';
import { Erc1155TransactionRepository } from 'src/repository/erc1155Transaction.repository';
import { Erc721TransactionRepository } from 'src/repository/erc721Transaction.repository';
import { InternalTransactionRepository } from 'src/repository/internalTransaction.repository';
import { Erc1155Transaction } from 'src/entity/erc1155Transaction.entity';
import { Erc721Transaction } from 'src/entity/erc721Transaction.entity';
import { TransactionDetail } from 'src/entity/transactionDetail.entity';
import { TransactionDetailRepository } from 'src/repository/transactionDetail.repository';

@Processor('transaction')
@Injectable({})
export class TransactionProcessor {
  constructor(
    private readonly httpService: HttpService,
    private transactionRepository: TransactionRepository,
    private erc20TransactionRepository: Erc20TransactionRepository,
    private erc721TransactionRepository: Erc721TransactionRepository,
    private erc1155TransactionRepository: Erc1155TransactionRepository, // private internalTransactionRepository: InternalTransactionRepository,
    private transactionDetailRepository: TransactionDetailRepository,
  ) {}

  private readonly logger = new Logger(TransactionProcessor.name);

  async getData<T extends { chainId?: string } & BaseTransaction>(
    address: string,
    chainId: string,
    action: 'txlist' | 'tokentx' | 'tokennfttx' | 'token1155tx',
  ) {
    return new Promise((res) => {
      const pages: { page: number; endblock: string }[] = [];
      const offset = 100;

      const timer = setInterval(async () => {
        try {
          const pageNumber = pages.push({
            page: pages.length + 1,
            endblock: null,
          });
          this.logger.debug(
            `fetch ${action} page ${pageNumber} for ${address}`,
          );
          const response = await this.httpService.axiosRef.get<{
            result: T[];
          }>('https://api.etherscan.io/api', {
            params: {
              module: 'account',
              action: action,
              address: address,
              page: pageNumber,
              offset,
              startblock: 0,
              sort: 'asc',
              apikey: 'NA62M9YK9EFNQZKM15A538EEB9N9E4P5YK',
            },
          });

          this.logger.debug(
            `fetch ${action} page ${pageNumber} for ${address}. Got ${response.data.result.length} txs`,
          );
          if (response.data.result.length > 0) {
            pages[pageNumber - 1].endblock =
              response.data.result[response.data.result.length - 1].blockNumber;
            switch (action) {
              case 'txlist':
                const formattedResponse = response.data.result.map((item) => {
                  item.chainId = chainId;
                  return item;
                });
                await this.transactionRepository.save(formattedResponse);
                break;
              case 'tokentx':
                await this.erc20TransactionRepository.save(
                  response.data.result,
                );
                break;
              case 'tokennfttx':
                await this.erc721TransactionRepository.save(
                  response.data.result,
                );
                break;
              case 'token1155tx':
                await this.erc1155TransactionRepository.save(
                  response.data.result,
                );
                break;
              default:
                break;
            }
          }
          if (response.data.result.length < offset) {
            this.logger.debug(`fetch ${action} for ${address} completed.`);
            clearInterval(timer);
            res(pages);
          }
        } catch (error) {
          this.logger.debug(`fetch ${action} for ${address} failed.`, error);
          clearInterval(timer);
          res(false);
        }
      }, 1000);
    });
  }

  async actionGenerator() {
    const txList = await this.transactionRepository.getTxForActionGenerator();
    const done = [];

    return new Promise((res) => {
      const timer = setInterval(async () => {
        try {
          const index = done.push(txList[done.length].hash) - 1;
          const item = txList[index];

          this.logger.debug(`Get contract addr = ${item.to}`);
          const contract = await this.httpService.axiosRef.get(
            'https://api.etherscan.io/api',
            {
              params: {
                module: 'contract',
                action: 'getsourcecode',
                address: item.to,
                apikey: 'NA62M9YK9EFNQZKM15A538EEB9N9E4P5YK',
              },
            },
          );

          const contractName = contract.data.result[0].ContractName;
          this.logger.debug(`${item.to} ----> contractName = ${contractName}`);

          this.logger.debug(`get internal tx with hash = ${item.hash}`);

          const internalTx = await this.httpService.axiosRef.get(
            'https://api.etherscan.io/api',
            {
              params: {
                module: 'account',
                action: 'txlistinternal',
                txhash: item.hash,
                apikey: 'NA62M9YK9EFNQZKM15A538EEB9N9E4P5YK',
              },
            },
          );

          this.logger.debug(
            `hash(${item.hash}) got internalTx.length = ${internalTx.data.result.length}`,
          );

          if (
            internalTx.data.result.length === 1 &&
            internalTx.data.result[0].value !== '0'
          ) {
            const detail = new TransactionDetail();
            detail.actionContractName = contractName;
            detail.actionFunctionName = item.functionName.split('(')[0];
            detail.actionValue = internalTx.data.result[0].value;
            detail.txHash = item.hash;

            console.log(
              `[FOUND] ${item.functionName.split('(')[0]} ${
                internalTx.data.result[0].value
              } from ${contractName} ---- hash: ${item.hash}, to: ${item.to}`,
            );
            this.transactionDetailRepository.save(detail);
          }
          if (done.length === txList.length) {
            console.log('DONE');
            clearInterval(timer);
            res('Action generation completed');
          }
        } catch (error) {
          console.log('ERR => ', error);
        }
      }, 800);
    });
  }

  @Process('transcode')
  async handleTranscode(
    job: Job<{ address: string; chainId: string }>,
    cb: DoneCallback,
  ) {
    this.logger.debug('Start get transaction');

    const success = await this.getData<Transaction>(
      job.data.address,
      job.data.chainId || '1',
      'txlist',
    );

    this.logger.debug({ pages: success });

    if (success) {
      const result = Promise.all([
        this.getData<Erc20Transaction>(
          job.data.address,
          job.data.chainId || '1',
          'tokentx',
        ),
        this.getData<Erc721Transaction>(
          job.data.address,
          job.data.chainId || '1',
          'tokennfttx',
        ),
        this.getData<Erc1155Transaction>(
          job.data.address,
          job.data.chainId || '1',
          'token1155tx',
        ),
      ]);

      console.log('result =====> ', await result);
    }

    this.logger.debug('End get transaction');

    this.logger.debug('Start action generator');
    const actionResult = await this.actionGenerator();
    this.logger.debug({ actionResult });
    this.logger.debug('End action generator');

    actionResult
      ? cb(null, actionResult)
      : cb(new Error('Failed to fetch transaction'));
  }
}
