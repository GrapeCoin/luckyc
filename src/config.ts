export type Env = 'prod' | 'test' | 'goerli'

export interface TokenConfig {
  symbol: string
  decimals: number
  image: string
  address: string
}

export interface Profile {
  chain: string
  chainName: string
  rpc: string
  scan: string
  contract: string
  token: TokenConfig
}

export const profile: Record<Env, Profile> = {
  prod: {
    chain: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    rpc: 'https://bsc-dataseed1.binance.org',
    scan: 'https://bscscan.com/address/{address}',
    contract: '0x0000000000000000000000000000000000000000',
    token: {
      symbol: 'USDT',
      decimals: 18,
      image: 'https://pancakeswap.finance/images/tokens/0x55d398326f99059fF775485246999027B3197955.png',
      address: '0x55d398326f99059fF775485246999027B3197955',
    },
  },
  test: {
    chain: '0x61',
    chainName: 'BNB Smart Chain Testnet',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    scan: 'https://testnet.bscscan.com/address/{address}',
    contract: '0x63f989f879A9883A08b962de0d25BB47EED224AA',
    token: {
      symbol: 'LUCKYC',
      decimals: 18,
      image: '',
      address: '0x9d5F930A7E3CBa1b3C1e26B4942fB85036856BfD',
    },
  },
  goerli: {
    chain: '0x5',
    chainName: 'Goerli Testnet',
    rpc: 'https://goerli.infura.io/v3/',
    scan: 'https://goerli.etherscan.io/address/{address}',
    contract: '0xaBf48ce840F8D56ec2B38D84f44D3C78a281E042',
    token: {
      symbol: 'LUCKYC',
      decimals: 18,
      image: '',
      address: '0x9d5F930A7E3CBa1b3C1e26B4942fB85036856BfD',
    },
  },
}

export const BANNED_COUNTRIES = ['CN']
export const CURRENT_ENV: Env = 'goerli'

export const CONFIG = profile[CURRENT_ENV]