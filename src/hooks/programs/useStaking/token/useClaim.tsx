import { PublicKey } from '@solana/web3.js'
import React, { useCallback } from 'react'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { Text } from '@/contexts/theme/components'
import { useModal, useRefreshController } from '@/contexts'
import useAvailableRewardsQuery from './useAvailableRewardsQuery'
import TransactionalDialog, { TransactionEventCallback } from '@/components/transactional-dialog'
import { BeatLoader } from 'react-spinners'
import { useResponsive } from '@/contexts/theme'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const ClaimDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { data: availableRewards, isLoading } = useAvailableRewardsQuery(staker)
  const { forceRefresh } = useRefreshController()

  return (
    <TransactionalDialog
      transactionName={`Harvest rewards from ${staker.poolName}`}
      onSendTransaction={(callbacks: TransactionEventCallback) => staker?.claim(callbacks).then(forceRefresh)}
      title={`Harvest from ${staker.poolName} pool`}
      confirmButtonProps={{ children: 'Harvest now', disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {
        isLoading
          ? <Text textAlign={'center'} fontSize={'20px'}>Loading your rewards <BeatLoader size={12} /></Text>
          : (
            availableRewards?.gt(0)
              ? (
                <div>
                  <Text textAlign={'center'} fontSize={'20px'} mb={'16px'}>
                    {'You have  '}
                    <b className="primary">
                      {
                        `${availableRewards.toString()}${staker.poolName} `
                      }
                    </b>
                    rewards available now. <br />
                  </Text>
                  <Text textAlign={'center'} fontSize={'20px'}>
                    Would you like to harvest them all?
                  </Text>
                </div>
              )
              : (
                <Text textAlign={'center'} fontSize={'20px'}>You have no any rewards now.</Text>
              )
          )
      }
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
