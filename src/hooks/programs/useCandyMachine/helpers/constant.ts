import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { Idl } from '@project-serum/anchor'

const SOLANA_CLUSTER = process.env.REACT_APP_SOLANA_CLUSTER as Cluster
const END_POINT = process.env.REACT_APP_SOLANA_END_POINT || clusterApiUrl(SOLANA_CLUSTER)

export const SolanaConnection = new Connection(END_POINT, { disableRetryOnRateLimit: true })

export const CANDY_MACHINE_PROGRAM_IDL: Idl = require('../candy_machine_program_idl.json')

export const CANDY_MACHINE_PROGRAM_ID = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ')

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export const CitizenOneCandyMachineAddress = new PublicKey('QSFP2oQs1wtHDvTWBaXFo5qraNCwXX58UUnvU8cNmzh')

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

export const DEFAULT_TIMEOUT = 15000
export const MAX_NAME_LENGTH = 32
export const MAX_URI_LENGTH = 200
export const MAX_SYMBOL_LENGTH = 10
export const MAX_CREATOR_LEN = 32 + 1 + 1
