import React, { useCallback } from 'react'
import { useSolanaWeb3 } from '@/contexts'
import { Text, useModal } from '@banksea-finance/ui-kit'
import TransactionalDialog from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { NFTStakingPoolConfig } from '../../constants/nft'
import { buildClaimInstruction } from '../../helpers/instructions'
import { WalletNotConnectedError } from '@/utils/errors'
import { buildTransaction } from '@/utils'

const NFTClaimDialog: React.FC<{ config: NFTStakingPoolConfig }> = ({ config }) => {
  const { pool: pool, name } = config
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(config.pool)
  const { account } = useSolanaWeb3()
  const program = useStakingProgram()

  const handleClaim = useCallback(async () => {
    if (!account) throw WalletNotConnectedError

    return buildTransaction(program.provider, [
      await buildClaimInstruction({
        user: account,
        program,
        pool
      })
    ])
  }, [config, account, program])

  return (
    <TransactionalDialog
      maxWidth={'600px'}
      transactionName={`Harvest rewards from ${name}`}
      title={`Harvest from ${name} pool`}
      transactionsBuilder={handleClaim}
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
