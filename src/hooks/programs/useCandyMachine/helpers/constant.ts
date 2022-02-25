import { PublicKey } from '@solana/web3.js'

export const CANDY_MACHINE_PROGRAM_ID = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ')

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export type BankseaNftCollection = {
  name: string
  logo: string
  candyMachineAddress: PublicKey
  creator: PublicKey
}

export const BANKSEA_NFT_COLLECTIONS: BankseaNftCollection[] = [
  {
    name: 'CitizenOne',
    logo: 'https://content.solsea.io/files/thumbnail/1643474033004-292668735.png',
    candyMachineAddress: new PublicKey('QSFP2oQs1wtHDvTWBaXFo5qraNCwXX58UUnvU8cNmzh'),
    creator: new PublicKey('4LVBRxUgQhJ8ZWn48SkJ4pgcNeZJekhSxq1uatDVUyoS')
  },

  {
    name: 'CitizenTwo',
    logo: 'https://content.solsea.io/files/thumbnail/1643474033004-292668735.png',
    candyMachineAddress: new PublicKey('QSFP2oQs1wtHDvTWBaXFo5qraNCwXX58UUnvU8cNmzh'),
    creator: new PublicKey('4LVBRxUgQhJ8ZWn48SkJ4pgcNeZJekhSxq1uatDVUyoS')
  }
]
