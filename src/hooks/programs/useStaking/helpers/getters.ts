import BigNumber from 'bignumber.js'
import { getPassbook } from './accounts'
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js'
import { BN, Program } from '@project-serum/anchor'
import { StakingProgramIdlType } from '../constants'
import { memoize } from 'lodash'

export type GetRewardTokenDecimalsProps = {
  program: Program<StakingProgramIdlType>
  pool: PublicKey
}

export type GetRewardsProps = {
  user: PublicKey
  pool: PublicKey
  program: Program<StakingProgramIdlType>
}

export const getTokenDecimals = memoize(
  (connection: Connection, tokenMint: PublicKey): Promise<number> => {
    return connection.getParsedAccountInfo(tokenMint).then(account => {
      return (account.value?.data as ParsedAccountData).parsed.info.decimals as number
    })
  },
  (connection: Connection, tokenMint: PublicKey) => connection.rpcEndpoint + tokenMint.toBase58()
)

export const getRewardTokenDecimals = memoize(
  ({ pool, program }: GetRewardTokenDecimalsProps): Promise<number> => {
    return program.account.pool
      .fetch(pool)
      .then(poolAccount => poolAccount.rewardMint)
      .then(rewardMint => getTokenDecimals(program.provider.connection, rewardMint))
  },
  ({ pool }) => pool.toBase58()
)

export async function getClaimedRewards(props: GetRewardsProps): Promise<BigNumber | undefined> {
  const passbook = await getPassbook(props)

  if (!passbook.account) {
    return new BigNumber(0)
  }

  const decimals = await getRewardTokenDecimals(props)

  return new BigNumber(passbook.account.claimedAmount.toString()).shiftedBy(-decimals)
}

export async function getHistoryTotalRewards(props: GetRewardsProps): Promise<BigNumber | undefined> {
  const { program, pool } = props
  const passbook = await getPassbook(props)

  if (!passbook.account) {
    return new BigNumber(0)
  }

  const poolAccount = await program.account.pool.fetch(pool)

  const slot = await program.provider.connection.getSlot('confirmed')

  const currentSeconds = (await program.provider.connection.getBlockTime(slot))!

  let rewardSlot = currentSeconds

  // check it is ending
  if (!poolAccount.endSec.eqn(0)) {
    rewardSlot = currentSeconds < poolAccount.endSec.toNumber() ? currentSeconds : poolAccount.endSec.toNumber()
  }

  const curSlot = new BN(rewardSlot)

  const multiple = new BN((1e18).toString())
  let factor = new BN(0)

  if (!poolAccount.totalStakingAmount.eqn(0)) {
    factor = BN
      .max(
        new BN(0),
        curSlot.sub(poolAccount.lastAccSec)
      )
      .mul(poolAccount.rewardPerSec)
      .mul(multiple)
      .div(poolAccount.totalStakingAmount)
  }

  factor = factor.add(poolAccount.lastAccRewardFactor as BN).sub(passbook.account.lastAccRewardFactor as BN)

  const IncRewardAmount = factor.mul(passbook.account.stakingAmount).div(multiple)

  const decimals = await getRewardTokenDecimals(props)

  return new BigNumber(passbook.account.rewardAmount.add(IncRewardAmount).toString()).shiftedBy(-decimals)
}

export async function getAvailableRewards(props: GetRewardsProps): Promise<BigNumber | undefined> {
  const historyTotalReward = (await getHistoryTotalRewards(props))!

  const claimedReward = (await getClaimedRewards(props))!

  return new BigNumber(historyTotalReward.minus(claimedReward).toString())
}

// export const getTokenStakingDepositTokenMint = memoize(
//   async (program: Program<StakingProgramIdlType>, whitelist: PublicKey): Promise<PublicKey> => {
//     const account = await program.account.whitelist.fetch(whitelist)
//
//     return account.addr
//   },
//   (program, whitelist) => whitelist.toBase58()
// )

export function getWhitelist(program: Program, pool: PublicKey, tokenMint: PublicKey) {
  const [whitelist] = PublicKey.findProgramAddressSync(
    [Buffer.from('whitelist'), pool.toBuffer(), tokenMint.toBuffer()],
    program.programId
  )

  return whitelist
}
