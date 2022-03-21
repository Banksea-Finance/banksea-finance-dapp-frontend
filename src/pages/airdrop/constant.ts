import { SupportedChainIds } from '@/hooks/useMultiChainsWeb3'

export type GrantInfo = {
  name: string
  image: string
}

export type GrantKeys = 'Polygon' | 'Filecoin' | 'OKExChain' | 'Solana-1' | 'Solana-2'

export type RegisterGrantConfig = {
  grantKey: GrantKeys
  name: string
  chainId: SupportedChainIds
  image: string
}

export const GrantsInfoByKey: Record<GrantKeys, GrantInfo> = {
  Polygon: {
    name: 'Polygon-Grants Hackathon Round-1',
    image: require('@/assets/images/grants/polygon.png')
  },
  Filecoin: {
    name: 'Filecoin Grant',
    image: require('@/assets/images/grants/filecoin.png')
  },
  OKExChain: {
    name: 'OKExChain Grant',
    image: require('@/assets/images/grants/okexchain.png')
  },
  'Solana-1': {
    name: 'Solana Grant',
    image: 'https://hackerlink.s3.amazonaws.com/static/files/Solana1_GKLekgH.jpg'
  },
  'Solana-2': {
    name: 'Solana Ignition Hackathon Round-2',
    image: 'https://hackerlink.s3.amazonaws.com/static/files/Solana2_eJt96fb.jpg'
  }
}

export const GrantsCanBeRegister: RegisterGrantConfig[] = [
  {
    grantKey: 'Polygon',
    name: 'Polygon-Grants Hackathon Round-1',
    chainId: 137,
    image: require('@/assets/images/grants/polygon.png')
  },
  {
    grantKey: 'Filecoin',
    name: 'Filecoin Grant',
    chainId: 56,
    image: require('@/assets/images/grants/filecoin.png')
  },
  {
    grantKey: 'OKExChain',
    name: 'OKExChain Grant',
    chainId: 66,
    image: require('@/assets/images/grants/okexchain.png')
  },
]
