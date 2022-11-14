export const erc20ToTxResponse = ({
  memo,
  ownerName,
  contactName,
  isDeposit,
  ...rest
}) => {
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
    contact_name: contactName,
    isDeposit: isDeposit,
    type: 'ERC20',

    rate: 1234,
    labels: [],
    tx_actions: null,
  };
};

export const erc721ToTxResponse = ({
  memo,
  ownerName,
  contactName,
  isDeposit,
  ...rest
}) => {
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
    contact_name: contactName,
    isDeposit: isDeposit,
    type: 'ERC721',

    rate: 1234,
    tx_actions: null,
    labels: [],
  };
};

export const erc1155ToTxResponse = ({
  memo,
  ownerName,
  contactName,
  isDeposit,
  ...rest
}) => {
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
    contact_name: contactName,
    isDeposit: isDeposit,
    type: 'ERC1155',

    rate: 1234,
    tx_actions: null,
    labels: [],
  };
};
