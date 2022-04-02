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
import useUserAvailableRewardsQuery from './useUserAvailableRewardsQuery'
import { useQuery } from 'react-query'
import { FormItem } from '@/components/form-item'
import { useResponsive } from '@/contexts/theme'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const WithdrawDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const { forceRefresh } = useRefreshController()
  const { data: userDeposits } = useUserDepositedQuery(staker)
  const { data: availableRewards } = useUserAvailableRewardsQuery(staker)
  const { data: decimals } = useQuery(['DEPOSITED_TOKEN_DECIMALS', staker.user, staker.poolName, staker.pool], () => staker.depositTokenDecimals())
  const { isMobile } = useResponsive()

  const inputInvalidError = useMemo(() => {
    if (!value || !decimals) {
      return undefined
    }

    if (new BigNumber(value).isNaN()) {
      return 'The input is not a number'
    }

    if ((/\d+\.(\d+)/.exec(value)?.[1]?.length || 0) > decimals) {
      return `Decimal places too large (maximum: ${decimals})`
    }
  }, [value, decimals])

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
    >
      <FormItem label={'You have deposited'} labelWidth={isMobile ? undefined : '166px'} labelPosition={'left'} justifyContent={isMobile ? 'space-between' : undefined}>
        <Text fontSize={'18px'} color={'primary'} bold>
          {
            userDeposits?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
          {' '}
          {staker.poolName}
        </Text>
      </FormItem>
      <FormItem label={'You want to withdraw'} labelWidth={'166px'} labelPosition={isMobile ? 'top' : 'left'}>
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
      </FormItem>

      <Flex alignItemsCenter style={{ minHeight: '24px' }}>
        <div style={{ width: isMobile? '4px' : '176px' }} />
        <Flex.Item flex={16}>
          <Text color={'failure'} bold>
            {inputInvalidError || ' '}
          </Text>
        </Flex.Item>
      </Flex>

      {
        availableRewards?.gt(0) && (
          <Flex alignItemsCenter justifyContent={'space-between'} style={{ marginTop: '8px' }}>
            <Text fontSize={'16px'} maxWidth={isMobile ? '85%' : undefined}>Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time</Text>
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
