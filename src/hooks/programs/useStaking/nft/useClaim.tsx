import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback } from 'react'
import { useModal, useRefreshController } from '@/contexts'
import { Dialog, Text } from '@/contexts/theme/components'
import useAvailableRewardsQuery from '@/hooks/programs/useStaking/nft/useAvailableRewardsQuery'

const NFTClaimDialog: React.FC<{ staker: NFTStaker }> = ({ staker }) => {
  const { closeModal } = useModal()
  const { data: availableRewards } = useAvailableRewardsQuery(staker)
  const { forceRefresh } = useRefreshController()

  return (
    <Dialog
      title={`Claim rewards from ${staker.poolName} pool`}
      width={'450px'}
      onCancel={closeModal}
      onConfirm={() => staker?.claim({ onSent: closeModal, onConfirm: forceRefresh })}
    >
      <Text fontSize={'18px'} textAlign={'center'}>
        Are you sure to withdraw rewards of {availableRewards?.toString()} {staker.rewardTokenName} from{' '}
        {staker.poolName} pool?
      </Text>
    </Dialog>
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
