import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useRefreshController } from '@/contexts'
import { Checkbox, Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import useUserDepositedQuery from './useUserDepositedQuery'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import useUserAvailableRewardsQuery from './useUserAvailableRewardsQuery'
import { useQuery } from 'react-query'
import { useResponsive } from '@/contexts/theme'
import Slider from 'rc-slider'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider)

const markNode = (number: number) => ({ style: { width: '8px' }, label: `${number}%` })
const sliderMarks = {
  0: markNode(0),
  25: markNode(25),
  50: markNode(50),
  75: markNode(75),
  100: markNode(100)
}

const WithdrawDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)
  const [checked, setChecked] = useState(true)
  const { forceRefresh } = useRefreshController()
  const { data: userDeposits } = useUserDepositedQuery(staker)
  const { data: availableRewards } = useUserAvailableRewardsQuery(staker)
  const { data: decimals } = useQuery(['DEPOSITED_TOKEN_DECIMALS', staker.user, staker.poolName, staker.pool], () => staker.depositTokenDecimals())
  const { isMobile } = useResponsive()

  const inputInvalidError = useMemo(() => {
    if (!inputValue || !decimals) {
      return undefined
    }

    if (new BigNumber(inputValue).isNaN()) {
      return 'The input is not a number'
    }

    if ((/\d+\.(\d+)/.exec(inputValue)?.[1]?.length || 0) > decimals) {
      return `Decimal places too large (maximum: ${decimals})`
    }
  }, [inputValue, decimals])

  const onInputChange = useCallback((v: any) => {
    const value: string = v.target.value

    if (+value < 0 || !userDeposits) {
      setInputValue('0')
      return
    }

    if (new BigNumber(value).gt(userDeposits)) {
      setInputValue(userDeposits.toString())
    } else {
      setInputValue(value.replace(/^0(\d)/, '$1'))
    }

    setSliderValue(
      +new BigNumber(value).multipliedBy(100).div(userDeposits).toFixed(0, BigNumber.ROUND_FLOOR)
    )
  }, [userDeposits])

  const onSliderChange = useCallback((v: number) => {
    setSliderValue(v)

    if (userDeposits) {
      if (v === 0) {
        setInputValue('0')
      } else if (v === 100) {
        setInputValue(userDeposits.toString())
      } else {
        setInputValue(new BigNumber(v).div(100).multipliedBy(userDeposits).toFixed(6))
      }
    }
  }, [userDeposits])

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${staker.poolName}`}
      onSendTransaction={(callbacks: TransactionEventCallback) => staker?.withdraw(new BigNumber(inputValue), checked, callbacks).then(forceRefresh)}
      title={`Withdraw ${staker.poolName}`}
      bottomMessage={{
        children: inputInvalidError,
        color: 'failure'
      }}
      confirmButtonProps={{ disabled: !!inputInvalidError || !inputValue.length || +inputValue <= 0 }}
    >
      <Text textAlign={'end'} mb={'8px'}>
        {'Deposited:'}
        <b className="primary" style={{ fontSize: '20px', margin: '0 4px 0 8px' }}>
          {
            userDeposits?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
        </b>
        { staker.poolName }
      </Text>

      <Input
        scale={'M'}
        value={inputValue}
        allowClear
        autoFocus
        onChange={onInputChange}
        mr={'4px'}
        mb={'8px'}
        suffix={
          <Text fontSize={'18px'} bold color={'primary'}>{staker.poolName}</Text>
        }
      />

      <SliderWithTooltip
        value={sliderValue}
        onChange={onSliderChange}
        style={{ width: '80%', left: '10%', height: '32px' }}
        marks={sliderMarks}
      />

      {
        availableRewards?.gt(0) && (
          <Flex alignItemsCenter justifyContent={'space-between'} style={{ marginTop: '8px' }}>
            <Text fontSize={'16px'} maxWidth={isMobile ? '85%' : undefined}>Harvest the rewards of {availableRewards?.toFixed(6)} KSE at the same time</Text>
            <Checkbox checked={checked} onChange={() => setChecked(b => !b)} />
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
