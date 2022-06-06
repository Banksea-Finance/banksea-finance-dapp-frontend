import React, { useCallback } from 'react'
import { Text, useModal } from '@banksea-finance/ui-kit'
import { useSolanaWeb3 } from '@/contexts'
import TransactionalDialog from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { buildTransaction } from '@/utils'
import { buildClaimInstructions } from '../../helpers/instructions'
import { WalletNotConnectedError } from '@/utils/errors'

const ClaimDialog: React.FC<TokenStakingPoolConfig> = ({ rewardToken, pool }) => {
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(pool)

  const handleClaim = useCallback(async () => {
    if (!user) throw WalletNotConnectedError

    return buildTransaction(program.provider, await buildClaimInstructions({ pool, user, program }))
  }, [user, pool, program])

  return (
    <TransactionalDialog
      transactionName={`Harvest rewards from ${rewardToken.name}`}
      transactionsBuilder={handleClaim}
      title={`Harvest rewards from ${rewardToken.name}`}
      confirmButtonProps={{ children: 'Harvest now', disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {isLoading ? (
        <Text textAlign={'center'} fontSize={'20px'}>
          Loading your rewards <BeatLoader size={12} />
        </Text>
      ) : availableRewards?.gt(0) ? (
        <div>
          <Text textAlign={'center'} fontSize={'20px'} mb={'16px'}>
            You have
            <b className="primary">{` ${availableRewards.toString()} ${rewardToken.name} `}</b>
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

const useClaim = (config: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!config) return

    openModal(<ClaimDialog {...config} />, false)
  }, [config])
}

export default useClaim
