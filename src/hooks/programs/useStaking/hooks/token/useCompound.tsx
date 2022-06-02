import React, { useCallback } from 'react'
import { Text, useModal } from '@banksea-finance/ui-kit'
import { useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import TransactionalDialog from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { BN } from '@project-serum/anchor'
import { buildClaimInstructions, buildDepositInstructions } from '../../helpers/instructions'
import { buildTransaction } from '@/utils'
import { getTokenDecimals, getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { getLargestTokenAccount } from '../../helpers/accounts'
import { DataLoadFailedError } from '../../helpers/errors'
import { WalletNotConnectedError } from '@/utils/errors'

const CompoundDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { depositTokenName, rewardTokenName, pool, whitelist } = config
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(config.pool)
  const { account: user } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const handleCompound = useCallback(async () => {
    if (!user) throw WalletNotConnectedError
    if (!availableRewards) throw DataLoadFailedError('availableRewards')

    const decimals = await getTokenDecimals(
      connection,
      await getTokenStakingDepositTokenMint(program, config.whitelist)
    )

    const amount = new BN(availableRewards.shiftedBy(decimals).toString())

    const claimInstructions = await buildClaimInstructions({
      pool,
      user,
      program,
      amount
    })

    const depositTokenMint = await getTokenStakingDepositTokenMint(program, config.whitelist)
    const depositAccount = await getLargestTokenAccount(program.provider.connection, user, depositTokenMint).then(
      account => account?.pubkey
    )

    const { instructions: depositInstructions, signers } = await buildDepositInstructions({
      amount,
      depositAccount,
      pool,
      program,
      tokenMint: depositTokenMint,
      user
    })

    return buildTransaction(program.provider, [...claimInstructions, ...depositInstructions], signers)
  }, [availableRewards, pool, user, whitelist])

  return (
    <TransactionalDialog
      transactionName={`Execute compounding with ${depositTokenName}`}
      transactionsBuilder={handleCompound}
      title={`Execute compounding with ${depositTokenName}`}
      confirmButtonProps={{ disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {isLoading ? (
        <Text textAlign={'center'} fontSize={'20px'}>
          Loading your rewards <BeatLoader size={12} />
        </Text>
      ) : availableRewards?.gt(0) ? (
        <div>
          <Text textAlign={'center'} fontSize={'20px'} mb={'16px'}>
            You have
            <b className="primary">{` ${availableRewards.toString()} ${rewardTokenName} `}</b>
            rewards available now. <br />
          </Text>
          <Text textAlign={'center'} fontSize={'20px'}>
            Would you like to harvest them all and deposit again?
          </Text>
        </div>
      ) : (
        <Text textAlign={'center'} fontSize={'20px'}>
          You have no any rewards now.
        </Text>
      )}
    </TransactionalDialog>
  )
}

const useCompound = (config?: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!config) return

    openModal(<CompoundDialog config={config} />, false)
  }, [config])
}

export default useCompound
