import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useRefreshController } from '@/contexts'
import { Button, Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import TransactionalDialog, { TransactionEventCallback } from '@/components/transactional-dialog'
import { ClipLoader } from 'react-spinners'
import usePoolBalanceQuery from '@/hooks/programs/useStaking/token/usePoolBalanceQuery'
import { useQuery } from 'react-query'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const DepositDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { forceRefresh } = useRefreshController()
  const [value, setValue] = useState('')
  const { data: poolBalance } = usePoolBalanceQuery(staker)

  const { data: decimals } = useQuery(['DEPOSITED_TOKEN_DECIMALS', staker.user, staker.poolName, staker.pool], () => staker.depositTokenDecimals())

  const inputInvalidError = useMemo(() => {
    if (!value || !decimals) {
      return
    }

    if (new BigNumber(value).isNaN()) {
      return 'The input is not a number'
    }

    if ((/\d+\.(\d+)/.exec(value)?.[1]?.length || 0) > decimals) {
      return 'Decimal places too large'
    }
  }, [value, decimals])


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
    <TransactionalDialog
      transactionName={`Deposit ${staker.poolName}`}
      onSendTransaction={(callbacks: TransactionEventCallback) => staker?.deposit(new BigNumber(value), callbacks).then(forceRefresh)}
      title={`Deposit ${staker.poolName}`}
      confirmButtonProps={{ disabled: !!inputInvalidError || !value.length || +value <= 0 }}
    >
      <div style={{ width: '550px' }}>
        <Flex row alignItemsCenter style={{ marginBottom: '16px' }}>
          <Flex.Item flex={10}>
            <Text textAlign={'end'} fontSize={'16px'}>You have</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Text fontSize={'18px'} bold color={'primary'}>
              {
                poolBalance?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
              }
              {' '}
              { staker.poolName }
            </Text>
          </Flex.Item>
        </Flex>
        <Flex row alignItemsCenter>
          <Flex.Item flex={10}>
            <Text textAlign={'end'} fontSize={'16px'}>You want to deposit</Text>
          </Flex.Item>
          <Flex.Item flex={1} />
          <Flex.Item flex={16}>
            <Flex alignItemsCenter>
              <Input
                autoFocus
                value={value}
                allowClear
                onChange={onChange}
                mr={'8px'}
                suffix={
                  <Text fontSize={'18px'} bold color={'primary'}>{staker.poolName}</Text>
                }
              />
              <Button
                scale={'xs'}
                variant={'primary'}
                onClick={() => poolBalance && setValue(poolBalance.toString())}
              >
                Max
              </Button>
            </Flex>
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

const useDeposit = (staker?: TokenStaker) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!staker) return

    openModal(<DepositDialog staker={staker} />, false)
  }, [staker])
}

export default useDeposit
