import React, { useCallback, useState } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useSolanaWeb3 } from '@/contexts'
import { Checkbox, Flex, Text } from '@/contexts/theme/components'
import TransactionalDialog from '@/components/TransactionalDialog'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { useResponsive } from '@/contexts/theme'
import { chunk } from 'lodash'
import { Transaction } from '@solana/web3.js'
import { buildClaimInstruction, buildWithdrawInstruction } from '../../helpers/instructions'
import { NFTStakingPoolConfig } from '../../constants/nft'
import { WalletNotConnectedError } from '@/utils/errors'

const NFTWithdrawDialog: React.FC<{ config: NFTStakingPoolConfig; metadataList: MetadataResult[] }> = ({
  config,
  metadataList
}) => {
  const { pool: pool, name } = config
  const [claimAtSameTime, setClaimAtSameTime] = useState(true)
  const { closeModal } = useModal()
  const { data: availableRewards } = useUserAvailableRewardsQuery(config.pool)
  const { isMobile } = useResponsive()

  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  const handleDeposit = useCallback(async () => {
    if (!user) throw WalletNotConnectedError

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

    return Promise.all(
      chunk(instructions, 6).map(async chunk =>
        new Transaction({
          recentBlockhash: (await program.provider.connection.getLatestBlockhash()).blockhash,
          feePayer: user
        }).add(...chunk)
      )
    )
  }, [user, claimAtSameTime])

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${name}`}
      title={`Withdraw ${name}`}
      onCancel={closeModal}
      transactionsBuilder={handleDeposit}
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