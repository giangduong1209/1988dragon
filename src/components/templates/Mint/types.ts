import { EvmNft } from 'moralis/common-evm-utils';

type TMint = {
  to: string | undefined;
  from: string;
  nonce: string | undefined;
  gas: string | undefined;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  blockNumber: string;
  value: string | undefined;
  chain: string | number;
  contractAddress: string | undefined;
  logs: {
    address: string;
    logIndex?: number | undefined;
    transactionHash: string;
    transactionIndex?: number | undefined;
    data: string;
    topics: string[];
    blockHash: string;
    blockNumber: number;
    blockTimestamp?: string | undefined;
  }[];
  data?: string | undefined;
  hash: string;
  type?: number | undefined;
  index: number;
  blockHash: string;
  blockTimestamp: Date;
  receiptRoot?: string | undefined;
  receiptStatus?: number | undefined;
};

export interface metadata {
  name: string;
  description: string;
  edition: number;
  date: number;
  image: string;
}
export interface IMint {
  mints?: TMint[];
  nfts?: EvmNft[];
}

export interface IData {
  nft: EvmNft;
  price: string | undefined;
}
