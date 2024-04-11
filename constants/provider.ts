import { ethers } from 'ethers';
import { ChainType } from '../enum';
// 2. Define network configurations
const providerRPC = {
  [ChainType.TESTNET]: {
    bsc: {
      name: 'bscTestnet',
      rpc: 'https://data-seed-prebsc-1-s3.binance.org:8545',
      chainId: 97,
    },
  },
  [ChainType.MAINNET]: {
    bsc: {
      name: 'bscMainnet',
      rpc: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
    },
  },
};
// 3. Create ethers provider
const provider = (env: ChainType) => {
  return new ethers.providers.StaticJsonRpcProvider(providerRPC?.[env].bsc.rpc, {
    chainId: providerRPC?.[env].bsc.chainId,
    name: providerRPC?.[env].bsc.name,
  });
};
export default provider;
