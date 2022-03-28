import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback, useState } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useRefreshController } from '@/contexts'
import { Checkbox, Text } from '@/contexts/theme/components'
import TransactionalDialog from '@/components/transactional-dialog'
import { Flex } from '@react-css/flex'
import useAvailableRewardsQuery from './useAvailableRewardsQuery'

const NFTWithdrawDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  const [checked, setChecked] = useState(false)
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${staker.poolName}`}
      title={`Withdraw ${staker.poolName}`}
      width={'600px'}
      onCancel={closeModal}
      onSendTransaction={callbacks => staker?.withdraw(metadataResult.mint, checked, callbacks).then(forceRefresh)}
    >
      <Text fontSize={'18px'} mb={'8px'}>
        Are you sure to withdraw {metadataResult.account?.data.data.name}?
      </Text>

      {availableRewards?.gt(0) && (
        <Flex alignItemsCenter>
          <Text fontSize={'16px'}>Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time</Text>
          <Checkbox value={checked} onChange={() => setChecked(b => !b)} />
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
