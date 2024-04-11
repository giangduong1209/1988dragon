import { EvmNft } from 'moralis/common-evm-utils';
import { INFT } from '../interface';

const mapToNFT = (nft: EvmNft): INFT => {
  return {
    amount: nft.amount,
    contractType: nft.contractType,
    symbol: nft.symbol,
    name: nft.name,
    tokenAddress: nft.tokenAddress?.format()?.toLowerCase(),
    tokenId: nft?.result?.tokenId,
    tokenUri: nft?.result?.tokenUri ?? '',
  };
};
export default mapToNFT;
