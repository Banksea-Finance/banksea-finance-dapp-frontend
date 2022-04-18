import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useRefreshController } from '@/contexts'
import { Input, Text } from '@/contexts/theme/components'
import BigNumber from 'bignumber.js'
import { TokenStaker } from '@/hooks/programs/useStaking/helpers/TokenStaker'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import usePoolBalanceQuery from '@/hooks/programs/useStaking/token/usePoolBalanceQuery'
import { useQuery } from 'react-query'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

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

const DepositDialog: React.FC<{ staker: TokenStaker }> = ({ staker }) => {
  const { forceRefresh } = useRefreshController()
  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)

  const { data: poolBalance } = usePoolBalanceQuery(staker)

  const { data: decimals } = useQuery(['DEPOSITED_TOKEN_DECIMALS', staker.user, staker.poolName, staker.pool], () => staker.depositTokenDecimals())

  const inputInvalidError = useMemo(() => {
    if (!inputValue || !decimals) {
      return
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

    if (+value < 0 || !poolBalance) {
      setInputValue('0')
      return
    }

    if (new BigNumber(value).gt(poolBalance)) {
      setInputValue(poolBalance.toString())
    } else {
      setInputValue(value.replace(/^0(\d)/, '$1'))
    }

    setSliderValue(
      +new BigNumber(value).multipliedBy(100).div(poolBalance).toFixed(0, BigNumber.ROUND_FLOOR)
    )
  }, [poolBalance])

  const onSliderChange = useCallback((v: number) => {
    setSliderValue(v)

    if (poolBalance) {
      if (v === 0) {
        setInputValue('0')
      } else if (v === 100) {
        setInputValue(poolBalance.toString())
      } else {
        setInputValue(new BigNumber(v).div(100).multipliedBy(poolBalance).toFixed(6))
      }
    }
  }, [poolBalance])

  return (
    <TransactionalDialog
      transactionName={`Deposit ${staker.poolName}`}
      onSendTransaction={(callbacks: TransactionEventCallback) => staker?.deposit(new BigNumber(inputValue), callbacks).then(forceRefresh)}
      title={`Deposit ${staker.poolName}`}
      bottomMessage={{
        children: inputInvalidError,
        color: 'failure'
      }}
      confirmButtonProps={{ disabled: !!inputInvalidError || !inputValue.length || +inputValue <= 0 }}
    >
      <Text textAlign={'end'} mb={'8px'}>
        {'Your Balance:'}
        <b className="primary" style={{ fontSize: '20px', margin: '0 4px 0 8px' }}>
          {
            poolBalance?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
        </b>
        { staker.poolName }
      </Text>
      <Input
        scale={'md'}
        autoFocus
        value={inputValue}
        allowClear
        onChange={onInputChange}
        mr={'4px'}
        mb={'8px'}
        style={{ flexGrow: 1 }}
        suffix={
          <Text fontSize={'18px'} bold color={'primary'}>{staker.poolName}</Text>
        }
      />

      <SliderWithTooltip
        value={sliderValue}
        onChange={onSliderChange}
        step={1}
        style={{ width: '80%', left: '10%', height: '32px' }}
        marks={sliderMarks}
      />
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
