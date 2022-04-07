import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import React, { useCallback, useState } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { useModal, useRefreshController } from '@/contexts'
import { Checkbox, Text } from '@/contexts/theme/components'
import TransactionalDialog from '@/components/TransactionalDialog'
import { Flex } from '@react-css/flex'
import { useResponsive } from '@/contexts/theme'

const NFTWithdrawDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  const [checked, setChecked] = useState(false)
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
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
