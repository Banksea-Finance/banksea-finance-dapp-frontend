import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback } from 'react'
import { useModal, useRefreshController } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import useAvailableRewardsQuery from '@/hooks/programs/useStaking/nft/useAvailableRewardsQuery'
import TransactionalDialog from '@/components/transactional-dialog'
import { BeatLoader } from 'react-spinners'

const NFTClaimDialog: React.FC<{ staker: NFTStaker }> = ({ staker }) => {
  const { data: availableRewards, isLoading } = useAvailableRewardsQuery(staker)
  const { forceRefresh } = useRefreshController()

  return (
    <TransactionalDialog
      title={`Harvest from ${staker.poolName} pool`}
      width={'550px'}
      onSendTransaction={callbacks => staker?.claim(callbacks).then(forceRefresh)}
      confirmButtonProps={{ children: 'Harvest now', disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {
        isLoading
          ? <Text textAlign={'center'} fontSize={'20px'}>Loading your rewards <BeatLoader size={12} /></Text>
          : (
            availableRewards?.gt(0)
              ? (
                <Text fontSize={'20px'} textAlign={'center'}>
                  Are you sure to harvest rewards of{' '}
                  <b className="primary">{` ${availableRewards?.toString()}${staker.rewardTokenName} `}</b>
                  {' from '}
                  {staker.poolName} pool?
                </Text>
              )
              : (
                <Text textAlign={'center'} fontSize={'20px'}>You have no any rewards now.</Text>
              )

          )
      }

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
