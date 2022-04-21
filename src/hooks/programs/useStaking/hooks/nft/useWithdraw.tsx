import React, { useCallback, useState } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Checkbox, Flex, Text } from '@/contexts/theme/components'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { useResponsive } from '@/contexts/theme'
import { waitTransactionConfirm } from '@/utils'
import { chunk } from 'lodash'
import { Transaction } from '@solana/web3.js'
import { buildClaimInstruction, buildWithdrawInstruction } from '../../helpers/instructions'
import { NFTStakingPoolConfig } from '../../constants/nft'
import { WalletNotConnectedError } from '../../helpers/errors'

const NFTWithdrawDialog: React.FC<{ config: NFTStakingPoolConfig; metadataList: MetadataResult[] }> = ({
  config,
  metadataList
}) => {
  const { pool: pool, name } = config
  const [claimAtSameTime, setClaimAtSameTime] = useState(true)
  const { closeModal } = useModal()
  const { data: availableRewards } = useUserAvailableRewardsQuery(config.pool)
  const { isMobile } = useResponsive()

  const { connection } = useSolanaConnectionConfig()
  const { account: user, adapter } = useSolanaWeb3()
  const program = useStakingProgram()

  const handleDeposit = useCallback(
    async (callbacks: TransactionEventCallback) => {
      if (!user || !adapter) throw WalletNotConnectedError

      const instructions = await Promise.all(
        metadataList.map(meta =>
          buildWithdrawInstruction({
            user: user,
            pool,
            tokenMint: meta.mint,
            program
          })
        )
      )

      if (claimAtSameTime) {
        instructions.push(
          await buildClaimInstruction({
            user,
            program,
            pool
          })
        )
      }
      callbacks.onTransactionBuilt?.()

      const transactions = await Promise.all(
        chunk(instructions, 6).map(async chunk =>
          new Transaction({
            recentBlockhash: (await program.provider.connection.getLatestBlockhash()).blockhash,
            feePayer: user
          }).add(...chunk)
        )
      )

      const rawTransactions = await adapter.signAllTransactions(transactions)

      const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
      callbacks.onSent?.()

      await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
      callbacks.onConfirm?.(signatures)
    },
    [user, adapter, connection, claimAtSameTime]
  )

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${name}`}
      title={`Withdraw ${name}`}
      onCancel={closeModal}
      onSendTransaction={handleDeposit}
    >
      <Text fontSize={'18px'} mb={'8px'} bold>
        Are you sure to withdraw {metadataList.map(o => o.account?.data.data.name).join(', ')}?
      </Text>

      {availableRewards?.gt(0) && (
        <Flex ai={'center'} jc={'space-between'}>
          <Text fontSize={'16px'} maxWidth={isMobile ? '85%' : undefined} style={{ marginTop: '8px' }}>
            Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time
          </Text>
          <Checkbox checked={claimAtSameTime} onChange={() => setClaimAtSameTime(b => !b)} />
        </Flex>
      )}
    </TransactionalDialog>
  )
}

const useWithdraw = (config: NFTStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(
    (metadataList: MetadataResult[]) => {
      if (!config) return

      openModal(<NFTWithdrawDialog config={config} metadataList={metadataList} />, false)
    },
    [config]
  )
}

export default useWithdraw
