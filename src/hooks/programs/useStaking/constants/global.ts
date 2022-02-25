import { PublicKey } from '@solana/web3.js'
import { IDL, Staking } from './idl'

export const StakingProgramAddress = new PublicKey('8EMGFmsk5mkbPMfCxoG1hTGsfTVaPuJh5Gx1esdHMxNh')

export const StakingWhitelistAccountAddress = new PublicKey('GNhSVBxugHgrPePgX8CBwcGGpM74GcD62DUC8tWJyT8S')

export type StakingProgramIdlType = Staking

export const StakingProgramIdl: Staking = IDL
