import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal } from '@/contexts'
import { Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import useUserDepositedQuery from './useUserDepositedQuery'
import { EventCallback } from '@/hooks/programs/useStaking/helpers/events'
import TransactionalDialog from '@/components/TransactionalDialog'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const WithdrawDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const [value, setValue] = useState('')

  const { data: userDeposits } = useUserDepositedQuery(staker)

  const inputInvalidError = useMemo(() => {
    if (!value) {
      return
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
      onSendTransaction={(callbacks: EventCallback) => staker?.withdraw(new BigNumber(value), callbacks)}
      title={`Withdraw ${staker.poolName}`}
    >
      <div style={{ width: '550px' }}>
        <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
          <Flex.Item flex={12}>
            <Text textAlign={'end'}>You have deposited</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Text>
              {userDeposits?.toString() || (
                <img
                  style={{ width: '16px' }}
                  src="https://i.stack.imgur.com/kOnzy.gif"
                  alt=""
                />
              )}
            </Text>
          </Flex.Item>
        </Flex>
        <Flex row alignItemsCenter>
          <Flex.Item flex={12}>
            <Text textAlign={'end'}>You want to withdraw</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Input value={value} allowClear onChange={onChange} />
          </Flex.Item>
        </Flex>
        <Flex row alignItemsCenter style={{ height: '24px' }}>
          <Flex.Item flex={13} />
          <Flex.Item flex={16}>
            <Text color={'orangered'} bold>
              {inputInvalidError}
            </Text>
          </Flex.Item>
        </Flex>
      </div>
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