export const erc20ToTxResponse = ({ memo, ownerName, ...rest }) => {
  return {
    tx_hash: rest.hash,
    from_addr: rest.from,
    to_addr: rest.to,
    tx_timestamp: rest.time_stamp,
    tx_value: rest.value,
    tx_gas: rest.gas,
    tx_gas_price: rest.gas_price,
    symbol: rest.token_symbol,
    tokenId: null,
    tokenValue: null,
    tokenDecimal: rest.token_decimal,

    memo: memo,
    owner: ownerName,
    type: 'ERC20',

    rate: 1234,
    labels: [],
    contact_name: null,
    tx_actions: null,
  };
};

export const erc721ToTxResponse = ({ memo, ownerName, ...rest }) => {
  return {
    tx_hash: rest.hash,
    from_addr: rest.from,
    to_addr: rest.to,
    tx_timestamp: rest.time_stamp,
    tx_value: 'null',
    tx_gas: rest.gas,
    tx_gas_price: rest.gas_price,
    symbol: rest.token_symbol,
    tokenId: rest.token_id,
    tokenValue: null,
    tokenDecimal: rest.token_decimal,

    memo: memo,
    owner: ownerName,
    type: 'ERC721',

    rate: 1234,
    tx_actions: null,
    labels: [],
    contact_name: null,
  };
};

export const erc1155ToTxResponse = ({ memo, ownerName, ...rest }) => {
  return {
    tx_hash: rest.hash,
    from_addr: rest.from,
    to_addr: rest.to,
    tx_timestamp: rest.time_stamp,
    tx_value: 'null',
    tx_gas: rest.gas,
    tx_gas_price: rest.gas_price,
    symbol: rest.token_symbol,
    tokenId: rest.token_id,
    tokenValue: rest.token_value,
    tokenDecimal: null,

    memo: memo,
    owner: ownerName,
    type: 'ERC1155',

    rate: 1234,
    tx_actions: null,
    labels: [],
    contact_name: null,
  };
};
