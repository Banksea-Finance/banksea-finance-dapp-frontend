import React, { useCallback } from 'react'
import { useModal } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { NFTStaker } from '@/hooks/programs/useStaking/helpers/NFTStaker'
import TransactionalDialog from '@/components/TransactionalDialog'

const NFTDepositDialog: React.FC<{ staker: NFTStaker; metadataResult: MetadataResult }> = ({
  staker,
  metadataResult
}) => {
  return (
    <TransactionalDialog
      title={`Deposit ${staker.poolName}`}
      width={'600px'}
      onSendTransaction={callbacks => staker?.deposit(metadataResult.mint, metadataResult.address, callbacks)}
    >
      <Text bold fontSize={'24px'}>
        Are you sure to deposit {metadataResult.account?.data.data.name}?
      </Text>
    </TransactionalDialog>
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
