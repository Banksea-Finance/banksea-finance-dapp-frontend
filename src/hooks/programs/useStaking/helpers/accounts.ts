import { AccountInfo, Connection, ParsedAccountData, PublicKey, TokenAmount } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { AccountFromIDL } from '@/utils/types'
import { Program } from '@project-serum/anchor'
import { StakingProgramIdlType } from '../constants'

export type Passbook = {
  address: PublicKey
  bump: number
  account: AccountFromIDL<StakingProgramIdlType, 'passbook'> | null
}

export async function getPassbook(props: {
  pool: PublicKey
  user: PublicKey
  program: Program<StakingProgramIdlType>
}): Promise<Passbook> {
  const { program, pool, user } = props

  const [address, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('passbook'), pool.toBuffer(), user.toBuffer()],
    program.programId
  )

  const account = await program.account.passbook.fetchNullable(address)

  return {
    address,
    bump,
    account
  }
}

export async function getAsset(props: {
  passbook: PublicKey
  tokenMint: PublicKey
  program: Program<StakingProgramIdlType>
}): Promise<{
  assetAddress: PublicKey
  assetBump: number
  assetAccount: AccountFromIDL<StakingProgramIdlType, 'asset'> | null
}> {
  const { program, tokenMint, passbook } = props

  const [assetAddress, assetBump] = await PublicKey.findProgramAddress(
    [Buffer.from('asset'), passbook.toBuffer(), tokenMint.toBuffer()],
    program.programId
  )

  const assetAccount = await program.account.asset.fetchNullable(assetAddress)

  return {
    assetAddress,
    assetBump,
    assetAccount
  }
}

export async function getLargestTokenAccount(
  conn: Connection, owner: PublicKey, mint: PublicKey
): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> } | undefined> {
  const accounts = await conn.getParsedTokenAccountsByOwner(owner, { mint })

  const getAmount = (account: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }) => (account.account.data.parsed.info.tokenAmount as TokenAmount).amount

  if (!accounts.value.length) {
    return undefined
  }

  accounts.value.sort((a, b) => +getAmount(b) - (+getAmount(a)))

  console.log(accounts.value)

  return accounts.value[0]
}
