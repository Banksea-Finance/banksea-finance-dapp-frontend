import React, { useCallback } from 'react'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { Transaction } from '@solana/web3.js'
import { waitTransactionConfirm } from '@/utils'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { NFTStakingPoolConfig } from '../../constants/nft'
import { buildClaimInstruction } from '../../helpers/instructions'
import { WalletNotConnectedError } from '../../helpers/errors'

const NFTClaimDialog: React.FC<{ config: NFTStakingPoolConfig }> = ({ config }) => {
  const { pool: pool, name } = config
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(config.pool)
  const { adapter, account } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const handleClaim = useCallback(
    async (callbacks: TransactionEventCallback) => {
      if (!account || !adapter) throw WalletNotConnectedError

      const tx = new Transaction().add(
        await buildClaimInstruction({
          user: account,
          program,
          pool
        })
      )
      callbacks?.onTransactionBuilt?.()

      const signature = await program.provider.send(tx)
      callbacks?.onSent?.()

      await waitTransactionConfirm(connection, signature)
      callbacks?.onConfirm?.(signature)
    },
    [adapter, config, account, program]
  )

  return (
    <TransactionalDialog
      transactionName={`Harvest rewards from ${name}`}
      title={`Harvest from ${name} pool`}
      onSendTransaction={handleClaim}
      confirmButtonProps={{ children: 'Harvest now', disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {isLoading ? (
        <Text textAlign={'center'} fontSize={'20px'}>
          Loading your rewards <BeatLoader size={12} />
        </Text>
      ) : availableRewards?.gt(0) ? (
        <Text fontSize={'20px'} textAlign={'center'}>
          Are you sure to harvest rewards of{' '}
          <b className="primary">{` ${availableRewards?.toString()}${config.rewardTokenName} `}</b>
          {' from '}
          {name} pool?
        </Text>
      ) : (
        <Text textAlign={'center'} fontSize={'20px'}>
          You have no any rewards now.
        </Text>
      )}
    </TransactionalDialog>
  )
}

const useClaim = (config: NFTStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!config) return

    openModal(<NFTClaimDialog config={config} />, false)
  }, [config])
}

export default useClaim
