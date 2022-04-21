import React, { useCallback } from 'react'
import { Text } from '@/contexts/theme/components'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { BN } from '@project-serum/anchor'
import { buildClaimInstruction, buildDepositInstructions } from '../../helpers/instructions'
import { buildTransaction, waitTransactionConfirm } from '@/utils'
import { getTokenDecimals, getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { getLargestTokenAccount } from '../../helpers/accounts'
import { WalletNotConnectedError, DataLoadFailedError } from '../../helpers/errors'

const CompoundDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { depositTokenName, rewardTokenName, pool, whitelist } = config
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(config.pool)
  const { account: user, adapter } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const handleCompound = useCallback(
    async (callbacks: TransactionEventCallback) => {
      if (!user || !adapter) throw WalletNotConnectedError
      if (!availableRewards) throw DataLoadFailedError('availableRewards')

      const decimals = await getTokenDecimals(
        connection,
        await getTokenStakingDepositTokenMint(program, config.whitelist)
      )

      const amount = new BN(availableRewards.shiftedBy(decimals).toString())

      const claimInstruction = await buildClaimInstruction({
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
        user,
        whitelist
      })

      const transaction = await buildTransaction(program.provider, [claimInstruction, ...depositInstructions], signers)
      callbacks.onTransactionBuilt?.()

      const rawTransactions = await adapter.signAllTransactions([transaction])
      const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
      callbacks.onSent?.()

      await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
      callbacks.onConfirm?.(signatures)
    },
    [availableRewards, pool, user, whitelist]
  )

  return (
    <TransactionalDialog
      transactionName={`Execute compounding with ${depositTokenName}`}
      onSendTransaction={handleCompound}
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
            {'You have  '}
            <b className="primary">{`${availableRewards.toString()}${rewardTokenName} `}</b>
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

const useCompound = (staker?: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<CompoundDialog config={staker} />, false)
  }, [staker])
}

export default useCompound
