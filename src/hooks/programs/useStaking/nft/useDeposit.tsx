import React, { useCallback } from 'react'
import { useModal, useRefreshController } from '@/contexts'
import { Dialog, Text } from '@/contexts/theme/components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'

const NFTDepositDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()

  return (
    <Dialog
      title={`Deposit ${staker.poolName}`}
      width={'600px'}
      onCancel={closeModal}
      onConfirm={() =>
        staker?.deposit(metadataResult.mint, metadataResult.address, { onSent: closeModal, onConfirm: forceRefresh })}
    >
      <Text bold fontSize={'24px'}>
        Are you sure to deposit {metadataResult.data?.name}?
      </Text>
    </Dialog>
  )
}

const useDeposit = (staker?: NFTStaker) => {
  const { openModal } = useModal()

  return useCallback(async (metadataResult: MetadataResult) => {
    if (!staker) return

    openModal(<NFTDepositDialog staker={staker} metadataResult={metadataResult} />, false)
  }, [staker])
}

export default useDeposit
