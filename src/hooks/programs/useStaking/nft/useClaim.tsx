import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback } from 'react'
import { useModal } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import useAvailableRewardsQuery from '@/hooks/programs/useStaking/nft/useAvailableRewardsQuery'
import TransactionalDialog from '@/components/transactional-dialog'

const NFTClaimDialog: React.FC<{ staker: NFTStaker }> = ({ staker }) => {
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  return (
    <TransactionalDialog
      title={`Claim rewards from ${staker.poolName} pool`}
      width={'450px'}
      onSendTransaction={callbacks => staker?.claim(callbacks)}
    >
      <Text fontSize={'18px'} textAlign={'center'}>
        Are you sure to withdraw rewards of {availableRewards?.toString()} {staker.rewardTokenName} from{' '}
        {staker.poolName} pool?
      </Text>
    </TransactionalDialog>
  )
}

const useClaim = (staker?: NFTStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<NFTClaimDialog staker={staker} />, false)
  }, [staker])
}

export default useClaim
