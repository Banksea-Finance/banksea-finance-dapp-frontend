import { PublicKey } from '@solana/web3.js'
import { CollectionStorageProgramId } from './constants'

export function getPassbookSigner(pool: PublicKey, user: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('passbook'), pool.toBuffer(), user.toBuffer()],
    CollectionStorageProgramId
  )
}

export function getAssetSigner(passbook: PublicKey, token: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('asset'), passbook.toBuffer(), token.toBuffer()],
    CollectionStorageProgramId
  )
}

export function getStakingSigner(passbook: PublicKey, token: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('staking_signer'), passbook.toBuffer(), token.toBuffer()],
    CollectionStorageProgramId
  )
}

export function getWhitelistSigner(pool: PublicKey, token: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('whitelist'), pool.toBuffer(), token.toBuffer()],
    CollectionStorageProgramId
  )
}
