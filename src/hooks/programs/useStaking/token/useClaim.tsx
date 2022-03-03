import { PublicKey } from '@solana/web3.js'
import React, { useCallback } from 'react'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { Dialog, Text } from '@/contexts/theme/components'
import { useModal, useRefreshController } from '@/contexts'
import useAvailableRewardsQuery from '@/hooks/programs/useStaking/token/useAvailableRewardsQuery'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const ClaimDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  return (
    <Dialog
      title={`Harvest ${staker.poolName}`}
      onConfirm={() => staker?.claim({ onSent: closeModal, onConfirm: forceRefresh })}
      onCancel={closeModal}
      confirmButtonProps={{ disabled: false, children: 'Harvest it now!' }}
    >
      <div style={{ width: '550px' }}>
        <Text textAlign={'center'} fontSize={'24px'} mb={'16px'}>
          You have {availableRewards ? availableRewards.toFixed(6) : '-'} {staker.poolName} rewards available now
        </Text>
        <Text textAlign={'center'} fontSize={'24px'}>Would you like to harvest them all?</Text>
      </div>
    </Dialog>
  )
}

const useClaim = (staker?: TokenStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<ClaimDialog staker={staker} />, false)
  }, [staker])
}

export default useClaim
