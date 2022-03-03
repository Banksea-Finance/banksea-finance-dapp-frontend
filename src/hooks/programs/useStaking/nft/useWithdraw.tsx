import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useRefreshController } from '@/contexts'
import { Dialog, Text } from '@/contexts/theme/components'

const NFTWithdrawDialog: React.FC<{ staker: NFTStaker, metadataResult: MetadataResult }> = ({ staker, metadataResult }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()

  return (
    <Dialog
      title={`Withdraw ${staker.poolName}`}
      width={'600px'}
      onCancel={closeModal}
      onConfirm={() => staker?.withdraw(metadataResult.mint, { onSent: closeModal, onConfirm: forceRefresh })}
    >
      <Text bold fontSize={'24px'}>Are you sure to withdraw {metadataResult.data?.name}?</Text>
    </Dialog>
  )
}

const useWithdraw = (staker?: NFTStaker) => {
  const { openModal } = useModal()

  return useCallback(async (metadataResult: MetadataResult) => {
    if (!staker) return

    openModal(<NFTWithdrawDialog staker={staker} metadataResult={metadataResult} />, false)
  }, [staker])
}

export default useWithdraw
