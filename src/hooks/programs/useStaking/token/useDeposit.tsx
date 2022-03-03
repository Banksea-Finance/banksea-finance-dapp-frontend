import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useRefreshController } from '@/contexts'
import { Dialog, Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import { useQuery } from 'react-query'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const DepositDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { closeModal } = useModal()
  const { forceRefresh } = useRefreshController()

  const [value, setValue] = useState('')

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

  const { data: poolBalance } = useQuery<BigNumber>(['pool-balance', staker.pool], () => {
    return staker.getPoolBalance()
  }, { refetchInterval: false, refetchOnWindowFocus: false })

  const onChange = useCallback((v: any) => {
    const value = v.target.value

    if (+value < 0) {
      setValue('0')
      return
    }

    if (poolBalance && new BigNumber(value).gt(poolBalance)) {
      setValue(poolBalance.toString())
    } else {
      setValue(value)
    }
  }, [poolBalance])

  return (
    <Dialog
      title={`Deposit ${staker.poolName}`}
      onConfirm={() => staker?.deposit(new BigNumber(value), { onSent: closeModal, onConfirm: forceRefresh })}
      onCancel={closeModal}
      confirmButtonProps={{ disabled: !!inputInvalidError }}
    >
      <div style={{ width: '550px' }}>
        <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
          <Flex.Item flex={12}>
            <Text textAlign={'end'}>You have</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Text>{poolBalance?.toString() || '-'}</Text>
          </Flex.Item>
        </Flex>
        <Flex row alignItemsCenter>
          <Flex.Item flex={12}>
            <Text textAlign={'end'}>You want to deposit</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Input
              value={value}
              allowClear
              onChange={onChange}
            />
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
    </Dialog>
  )
}

const useDeposit = (staker?: TokenStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<DepositDialog staker={staker} />, false)
  }, [staker])
}

export default useDeposit
