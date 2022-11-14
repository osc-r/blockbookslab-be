import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/entity/transaction.entity';
import { ethers } from 'ethers';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTxForActionGenerator(): Promise<
    { hash: string; from: string; to: string; functionName: string }[]
  > {
    return await this.query(
      `
      SELECT 
        t.hash, 
        t."from", 
        t."to", 
        t.function_name AS "functionName"
      FROM "transaction" t WHERE t.hash NOT IN(
          SELECT a.hash FROM (
            SELECT t.hash FROM "transaction" t INNER JOIN erc20_transaction et ON et.hash = t.hash
            UNION
            SELECT t.hash FROM "transaction" t INNER JOIN erc721_transaction et ON et.hash = t.hash
            UNION
            SELECT t.hash FROM "transaction" t INNER JOIN erc1155_transaction et ON et.hash = t.hash
      ) a) 
      AND t.value = '0' 
      AND t.is_error = '0' 
      AND t.function_name != ''`,
    );
  }

  async getTransactions(
    userId: string,
    options: { current: string; limit: string },
  ): Promise<{
    txList: { hash: string; type: string }[];
    totalItem: number;
  }> {
    const offset = parseInt(options.current) * parseInt(options.limit);
    const totalQuery = `COUNT(*)`;
    const fieldQuery = `a.hash, a."type"`;
    const paginationQuery = `ORDER BY a.time_stamp DESC LIMIT ${options.limit} OFFSET ${offset}`;

    const q = (field: string, pagination?: string) => `
    SELECT ${field} FROM (
      SELECT et.hash, et."from", et."to", et.gas, et.gas_price, CAST(et."time_stamp" AS bigint), 'ERC20' AS "type" FROM erc20_transaction et
       LEFT JOIN "transaction" t ON et.hash = t.hash WHERE t.hash ISNULL
       UNION ALL
       SELECT et.hash, et."from", et."to", et.gas, et.gas_price, CAST(et."time_stamp" AS bigint), 'ERC721' AS "type" FROM erc721_transaction et
       LEFT JOIN "transaction" t ON et.hash = t.hash WHERE t.hash ISNULL
       UNION ALL
       SELECT et.hash, et."from", et."to", et.gas, et.gas_price, CAST(et."time_stamp" AS bigint), 'ERC1155' AS "type" FROM erc1155_transaction et
       LEFT JOIN "transaction" t ON et.hash = t.hash WHERE t.hash ISNULL
       UNION ALL
       SELECT t.hash, t."from", t."to", t.gas, t.gas_price, CAST(t."time_stamp" AS bigint), 'NORMAL' AS "type" FROM "transaction" t
      ) a 
      INNER JOIN wallet w ON w.address = a."from" OR  w.address = a."to"
      WHERE w.created_by = $1
      ${pagination || ''}
    `;

    const txList = await this.query(q(fieldQuery, paginationQuery), [userId]);
    const totalItem = await this.query(q(totalQuery), [userId]);

    return { txList, totalItem: parseInt(totalItem[0].count) };
  }

  async getNormalTransactionWithRelationshipByHash(
    hash: string,
    userId: string,
  ) {
    let tx = null;
    const ERC20 = [];
    const ERC721 = [];
    const ERC1155 = [];

    const q = `
    SELECT a.*, td.memo, td."actionFunctionName", td."actionContractName", td."actionValue", w."name" AS "ownerName",
      CASE WHEN a."from_addr" = w.address THEN FALSE ELSE TRUE END AS "isDeposit",
      (SELECT c."name" FROM contact c WHERE c.created_by = w.created_by AND c.address = (CASE WHEN a."from_addr" = w.address THEN a."to_addr" ELSE a."from_addr" END)) AS "contactName"
    FROM(
        SELECT 
          t.hash AS "tx_hash", 
          'ETH' AS "symbol", 
          '18' AS "tokenDecimal", 
          t."from" AS "from_addr", 
          t."to" AS "to_addr", 
          t.value AS "tx_value", 
          null AS "tokenId", 
          t.gas AS "tx_gas", 
          t.gas_price AS "tx_gas_price", 
          t."time_stamp" AS "tx_timestamp", 
          'NORMAL' AS "type" 
        FROM "transaction" t
        UNION ALL
        SELECT 
          et.hash AS "tx_hash",
          et.token_symbol AS "symbol",
          et.token_decimal  AS "tokenDecimal",
          et."from" AS "from_addr",
          et."to" AS "to_addr",
          et.value AS "tx_value",
          null AS "tokenId",
          et.gas AS "tx_gas",
          et.gas_price AS "tx_gas_price",
          et."time_stamp" AS "tx_timestamp",
          'ERC20' AS "type" 
        FROM erc20_transaction et INNER JOIN "transaction" t ON t.hash = et.hash
        UNION ALL
        SELECT 
          et1.hash AS "tx_hash",
          et1.token_symbol AS "symbol",
          et1.token_decimal  AS "tokenDecimal",
          et1."from" AS "from_addr",
          et1."to" AS "to_addr",
          null AS "tx_value",
          et1.token_id AS "tokenId",
          et1.gas AS "tx_gas",
          et1.gas_price AS "tx_gas_price",
          et1."time_stamp" AS "tx_timestamp",
          'ERC721' AS "type" 
        FROM erc721_transaction et1 INNER JOIN "transaction" t ON t.hash = et1.hash
        UNION ALL
        SELECT 
          et2.hash AS "tx_hash",
          et2.token_symbol AS "symbol",
          null AS "tokenDecimal",
          et2."from" AS "from_addr",
          et2."to" AS "to_addr",
          et2.token_value AS "tx_value",
          null AS "tokenId",
          et2.gas AS "tx_gas",
          et2.gas_price AS "tx_gas_price",
          et2."time_stamp" AS "tx_timestamp",
          'ERC1155' as "type" 
        FROM erc1155_transaction et2 INNER JOIN "transaction" t ON t.hash = et2.hash
      )a
  LEFT JOIN transaction_detail td ON td.tx_hash = a.tx_hash
  LEFT JOIN wallet w ON w.address = a."from_addr" OR w.address = a."to_addr"
  WHERE a.tx_hash = $1 AND w.created_by = $2`;

    const results = await this.query(q, [hash, userId]);

    results.forEach((i) => {
      switch (i.type) {
        case 'ERC20':
          ERC20.push(i);
          break;
        case 'ERC721':
          ERC721.push(i);
          break;
        case 'ERC1155':
          ERC1155.push(i);
          break;
        case 'NORMAL':
          tx = i;
          break;
      }
    });

    const response = {
      ...tx,
      erc20: ERC20,
      erc721: ERC721,
      erc1155: ERC1155,
      action: null,
    };

    if (ERC20.length !== 0 && ERC721.length !== 0 && ERC1155.length !== 0) {
    } else if (ERC721.length !== 0 && ERC1155.length !== 0) {
    } else if (ERC20.length !== 0 && ERC1155.length !== 0) {
    } else if (ERC20.length !== 0 && ERC721.length !== 0) {
    } else if (ERC20.length !== 0) {
      if (tx.tx_value !== '0' && ERC20.length === 1) {
        response.action = `Swap ${ethers.utils.formatEther(
          ethers.BigNumber.from(tx.tx_value),
        )} ETH For ${ethers.utils.formatUnits(
          ethers.BigNumber.from(ERC20[0].tx_value),
          parseInt(ERC20[0].tokenDecimal),
        )} ${ERC20[0].symbol}`;
      }
      if (tx.tx_value === '0' && ERC20.length === 1) {
        response.symbol = ERC20[0].symbol;
        response.tokenDecimal = ERC20[0].tokenDecimal;
        response.tx_value = ERC20[0].tx_value;
        response.type = 'ERC20';
        // response.action = `Transafer ${ethers.utils.formatUnits(
        //   ethers.BigNumber.from(ERC20[0].tx_value),
        //   ERC20[0].tokenDecimal,
        // )} ${ERC20[0].symbol}`;
      }
      if (tx.tx_value === '0' && ERC20.length === 2) {
        if (ERC20[0].symbol !== ERC20[1].symbol) {
          const from = ERC20[0].isDeposit === false ? ERC20[0] : ERC20[1];
          const to = ERC20[0].isDeposit === true ? ERC20[0] : ERC20[1];

          if (ERC20[0].from_addr === ERC20[1].from_addr) {
            response.action = 'Transfer ERC20 token';
          } else {
            response.action = `Swap ${ethers.utils.formatUnits(
              ethers.BigNumber.from(from.tx_value),
              from.tokenDecimal,
            )} ${from.symbol} For ${ethers.utils.formatUnits(
              ethers.BigNumber.from(to.tx_value),
              to.tokenDecimal,
            )} ${to.symbol}`;
          }
        } else {
          // response.action = '-';
        }
      }
    } else if (ERC721.length !== 0) {
      if (ERC721.length === 1 && ERC721[0].isDeposit === true) {
        response.action = `Mint ${ERC721[0].symbol} id: ${ERC721[0].tokenId}`;
        response.type = 'ERC721';
      }
    } else if (ERC1155.length !== 0) {
    } else {
      if (response.actionFunctionName) {
        response.symbol = response.actionContractName;
        response.tokenDecimal = 18;
        response.tx_value = response.actionValue;
        response.action = `${
          response.actionFunctionName
        } ${ethers.utils.formatEther(
          ethers.BigNumber.from(response.actionValue),
        )} ${response.actionContractName}`;
      }
    }
    return response;
  }
}
