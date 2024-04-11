const chain = {
  testnet: {
    bscChain: {
      id: 97,
      name: 'BSC',
      network: 'BSC Testnet',
      nativeCurrency: {
        decimals: 18,
        name: 'TBNB',
        symbol: 'TBNB',
      },
      rpcUrls: {
        default: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      },
      blockExplorers: {
        default: { name: 'Bscscan', url: 'https://testnet.bscscan.com/' },
      },
      testnet: true,
    },
  },
  mainnet: {
    bscChain: {
      id: 56,
      name: 'BSC',
      network: 'BSC Mainnet',
      nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
      },
      rpcUrls: {
        default: 'https://bsc-dataseed.binance.org/',
      },
      blockExplorers: {
        default: { name: 'Bscscan', url: 'https://bscscan.com/' },
      },
      testnet: false,
    },
  },
};

export default chain;
