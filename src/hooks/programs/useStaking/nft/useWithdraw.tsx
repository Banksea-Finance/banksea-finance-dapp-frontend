import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback, useState } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useRefreshController } from '@/contexts'
import { Checkbox, Text } from '@/contexts/theme/components'
import TransactionalDialog from '@/components/TransactionalDialog'
import { Flex } from '@react-css/flex'
import useUserAvailableRewardsQuery from './useUserAvailableRewardsQuery'
import { useResponsive } from '@/contexts/theme'

const NFTWithdrawDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  const [checked, setChecked] = useState(true)
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const { data: availableRewards } = useUserAvailableRewardsQuery(staker)
  const { isMobile } = useResponsive()

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${staker.poolName}`}
      title={`Withdraw ${staker.poolName}`}
      onCancel={closeModal}
      onSendTransaction={callbacks => staker?.withdraw(metadataResult.mint, checked, callbacks).then(forceRefresh)}
    >
      <Text fontSize={'18px'} mb={'8px'} bold>
        Are you sure to withdraw {metadataResult.account?.data.data.name}?
      </Text>

      {availableRewards?.gt(0) && (
        <Flex alignItemsCenter justifySpaceBetween>
          <Text
            fontSize={'16px'}
            maxWidth={isMobile ? '85%' : undefined}
            style={{ marginTop: '8px' }}
          >
            Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time
          </Text>
          <Checkbox checked={checked} onChange={() => setChecked(b => !b)} />
        </Flex>
      )}
    </TransactionalDialog>
  )
}

const useWithdraw = (staker?: NFTStaker) => {
  const { openModal } = useModal()

  return useCallback((metadataResult: MetadataResult) => {
    if (!staker) return

    openModal(<NFTWithdrawDialog staker={staker} metadataResult={metadataResult} />, false)
  }, [staker])
}

export default useWithdraw
