import { PublicKey } from '@solana/web3.js'
import { IDL, Staking } from './idl'

export const StakingProgramAddress = new PublicKey('8EMGFmsk5mkbPMfCxoG1hTGsfTVaPuJh5Gx1esdHMxNh')

export type StakingProgramIdlType = Staking

export const StakingProgramIdl: Staking = IDL
