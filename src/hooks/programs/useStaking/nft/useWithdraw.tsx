import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useRefreshController } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import TransactionalDialog from '@/components/transactional-dialog'

const NFTWithdrawDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()

  return (
    <TransactionalDialog
      title={`Withdraw ${staker.poolName}`}
      width={'600px'}
      onCancel={closeModal}
      onSendTransaction={callbacks => staker?.withdraw(metadataResult.mint, callbacks).then(forceRefresh)}
    >
      <Text fontSize={'24px'}>
        Are you sure to withdraw {metadataResult.account?.data.data.name}?
      </Text>
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
