interface INFT {
  amount?: number;
  contractType?: string;
  symbol?: string;
  name?: string;
  tokenAddress?: string;
  tokenId?: string | number;
  tokenUri?: string;
  metadata?: {
    date?: number;
    description?: string;
    dna?: string;
    edition?: number;
    image?: string;
    name?: string;
  } | null;
}

export default INFT;
