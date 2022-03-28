import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useRefreshController } from '@/contexts'
import { Button, Checkbox, Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import useUserDepositedQuery from './useUserDepositedQuery'
import TransactionalDialog, { TransactionEventCallback } from '@/components/transactional-dialog'
import { ClipLoader } from 'react-spinners'
import useAvailableRewardsQuery from './useAvailableRewardsQuery'
import { Grid } from '@react-css/grid'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const WithdrawDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const { forceRefresh } = useRefreshController()
  const { data: userDeposits } = useUserDepositedQuery(staker)
  const { data: availableRewards } = useAvailableRewardsQuery(staker)

  const inputInvalidError = useMemo(() => {
    if (!value) {
      return undefined
    }

    if (new BigNumber(value).isNaN()) {
      return 'The input is not a number'
    }

    if ((/\d+\.(\d+)/.exec(value)?.[1]?.length || 0) > 9) {
      return 'Decimal places too large'
    }
  }, [value])

  const onChange = useCallback(
    (v: any) => {
      const value = v.target.value

      if (+value < 0) {
        setValue('0')
        return
      }

      if (userDeposits && new BigNumber(value).gt(userDeposits)) {
        setValue(userDeposits.toString())
      } else {
        setValue(value)
      }
    },
    [userDeposits]
  )

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${staker.poolName}`}
      onSendTransaction={(callbacks: TransactionEventCallback) => staker?.withdraw(new BigNumber(value), checked, callbacks).then(forceRefresh)}
      title={`Withdraw ${staker.poolName}`}
      confirmButtonProps={{ disabled: !!inputInvalidError || !value.length || +value <= 0 }}
      width={'580px'}
    >
      <Grid gap={'16px 16px'} columns={'max-content max-content'} style={{ marginBottom: '16px', width: 'fit-content' }} alignItems={'center'}>
        <Text fontSize={'16px'}>You have deposited</Text>
        <Text fontSize={'18px'} color={'primary'} bold>
          {
            userDeposits?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
          {' '}
          {staker.poolName}
        </Text>

        <Text fontSize={'16px'}>You want to withdraw</Text>
        <Flex alignItemsCenter>
          <Input
            scale={'sm'}
            value={value}
            allowClear
            autoFocus
            onChange={onChange}
            mr={'8px'}
            suffix={
              <Text fontSize={'18px'} bold color={'primary'}>{staker.poolName}</Text>
            }
          />
          <Button
            scale={'xs'}
            variant={'primary'}
            onClick={() => userDeposits && setValue(userDeposits.toString())}
          >
            Max
          </Button>
        </Flex>

      </Grid>
      <Text color={'orangered'} bold>
        {inputInvalidError}
      </Text>
      {
        availableRewards?.gt(0) && (
          <Flex alignItemsCenter>
            <Text fontSize={'16px'}>Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time</Text>
            <Checkbox value={checked} onChange={() => setChecked(b => !b)} />
          </Flex>
        )
      }
    </TransactionalDialog>
  )
}

const useWithdraw = (staker?: TokenStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<WithdrawDialog staker={staker} />, false)
  }, [staker])
}

export default useWithdraw
