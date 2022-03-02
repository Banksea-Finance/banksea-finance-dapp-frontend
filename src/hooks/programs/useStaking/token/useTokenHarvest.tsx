import { PublicKey } from '@solana/web3.js'
import React, { useCallback } from 'react'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import BigNumber from 'bignumber.js'
import { useQuery } from 'react-query'
import { Dialog, Text } from '@/contexts/theme/components'
import { useModal } from '@/contexts'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const ClaimDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { closeModal } = useModal()

  const { data: availableRewards } = useQuery<string>(['available-rewards', staker.pool], async () => {
    const amount = await staker.getAvailableRewards()

    const decimals = await staker.getRewardTokenDecimals()

    BigNumber.config({
      EXPONENTIAL_AT: 10
    })

    return amount.div(new BigNumber(10).pow(decimals)).toString()
  }, { refetchInterval: 5000, refetchOnWindowFocus: false })

  return (
    <Dialog
      title={`Harvest ${staker.poolName}`}
      onConfirm={() => staker?.harvest()}
      onCancel={closeModal}
      confirmButtonProps={{ disabled: false, children: 'Harvest it now!' }}
    >
      <div style={{ width: '550px' }}>
        <Text textAlign={'center'} fontSize={'24px'} mb={'16px'}>You have {availableRewards} {staker.poolName} rewards
          available now
        </Text>
        <Text textAlign={'center'} fontSize={'24px'}>Would you like to harvest them all?</Text>
      </div>
    </Dialog>
  )
}

const useTokenHarvest = (staker?: TokenStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<ClaimDialog staker={staker} />)
  }, [staker])
}

export default useTokenHarvest
