interface INFTTransaction {
  // marketplace address
  address?: string;
  chainId?: number;
  itemId?: string;
  nftContract?: string;
  owner?: string;
  seller?: string;
  // price in wei
  price?: string;
  // PENDING | CANCLE | SOLD
  status?: string;
  tokenId?: string;
  transactionHash?: string;
  updatedAt?: Date;
  blockTimestamp?: number;
  image?: string;
}
export default INFTTransaction;
