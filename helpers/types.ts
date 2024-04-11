export interface Network {
  [key: string | number]: Chain;
}

interface Chain {
  chainId?: number;
  currencySymbol: string;
  chainName?: string;
  currencyName?: string;
  rpcUrl?: string;
  blockExplorerUrl?: string;
  wrapped?: string;
}
