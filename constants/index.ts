import chain from './chain';
import provider from './provider';
import { nftCollectionABI, marketplaceABI, paymentTokenABI, stakingABI } from './ABI';
import { nftCollectionAddr, marketplaceAddr, paymentTokenAddr, stakingAddr } from './address';
import { ChainType } from '../enum';
const CURRENT_NETWORK = ChainType.MAINNET;

const constants = {
  NFT_ADDR: nftCollectionAddr[CURRENT_NETWORK],
  NFT_ABI: JSON.parse(nftCollectionABI),
  MRKPLACE_ADDR: marketplaceAddr[CURRENT_NETWORK],
  MRKPLACE_ABI: JSON.parse(marketplaceABI),
  PMT_ADDR: paymentTokenAddr[CURRENT_NETWORK],
  PMT_ABI: JSON.parse(paymentTokenABI),
  STAKING_ADDR: stakingAddr[CURRENT_NETWORK],
  STAKING_ABI: JSON.parse(stakingABI),
  CHAIN: chain[CURRENT_NETWORK],
  PROVIDER: provider(CURRENT_NETWORK),
  GATEWAY: 'https://myipfs.mypinata.cloud',
  staking: {
    duration: {
      VALUE: 15,
      UNIT: 'minute',
    },
  },
};

export default constants;
