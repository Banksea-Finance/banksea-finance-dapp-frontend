import { PublicKey } from '@solana/web3.js'
import React, { useCallback } from 'react'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { Text } from '@/contexts/theme/components'
import { useModal } from '@/contexts'
import useAvailableRewardsQuery from './useAvailableRewardsQuery'
import TransactionalDialog from '@/components/transactional-dialog'
import { EventCallback } from '@/hooks/programs/useStaking/helpers/events'
import { ClipLoader } from 'react-spinners'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const ClaimDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { data: availableRewards, isLoading } = useAvailableRewardsQuery(staker)

  return (
    <TransactionalDialog
      onSendTransaction={(callbacks: EventCallback) => staker?.claim(callbacks)}
      title={`Harvest ${staker.poolName}`}
      confirmButtonProps={{ children: 'Harvest it now!' }}
    >
      <div style={{ width: '650px' }}>
        <Text textAlign={'center'} fontSize={'20px'} mb={'16px'}>
          {'You have  '}
          <b className="primary">
            {
              isLoading
                ? <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px; margin-right: 12px;'} />
                : (
                  availableRewards
                    ? `${availableRewards.toString()}${staker.poolName} `
                    : '-'
                )
            }

          </b>
          rewards available now
        </Text>
        <Text textAlign={'center'} fontSize={'20px'}>
          Would you like to harvest them all?
        </Text>
      </div>
    </TransactionalDialog>
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
