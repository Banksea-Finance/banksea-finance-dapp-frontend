import React, { useCallback } from 'react'
import { Text } from '@/contexts/theme/components'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { buildTransaction, waitTransactionConfirm } from '@/utils'
import { buildClaimInstruction } from '../../helpers/instructions'
import { WalletNotConnectedError } from '../../helpers/errors'

const ClaimDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { rewardTokenName, pool } = config
  const { account: user, adapter } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(pool)

  const handleClaim = useCallback(async (callbacks: TransactionEventCallback) => {
    if (!user || !adapter) throw WalletNotConnectedError

    const transaction = await buildTransaction(
      program.provider,
      [await buildClaimInstruction({ pool, user, program })]
    )
    callbacks.onTransactionBuilt?.()

    const rawTransactions = await adapter.signAllTransactions([transaction])
    const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
    callbacks.onSent?.()

    await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
    callbacks.onConfirm?.(signatures)
  }, [user, adapter, pool])

  return (
    <TransactionalDialog
      transactionName={`Harvest rewards from ${rewardTokenName}`}
      onSendTransaction={handleClaim}
      title={`Harvest rewards from ${rewardTokenName}`}
      confirmButtonProps={{ children: 'Harvest now', disabled: isLoading || !availableRewards?.gt(0) }}
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
            Would you like to harvest them all?
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

const useClaim = (staker?: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<ClaimDialog config={staker} />, false)
  }, [staker])
}

export default useClaim
