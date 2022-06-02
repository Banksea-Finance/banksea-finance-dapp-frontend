import { PublicKey } from '@solana/web3.js'
import { IDL, Staking } from './idl'

export const StakingProgramAddress = new PublicKey('FYmnBNQ1oEbpjtfcBtZPVgwNATqT64h2WV4d4r4ZSmJK')

export type StakingProgramIdlType = Staking

export const StakingProgramIdl: Staking = IDL
