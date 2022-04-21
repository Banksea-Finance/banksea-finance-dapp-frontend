import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Checkbox, Input, Text } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import BigNumber from 'bignumber.js'
import useUserDepositedQuery from './useUserDepositedQuery'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import { useResponsive } from '@/contexts/theme'
import Slider from 'rc-slider'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import useDepositTokenDecimalsQuery from './useDepositTokenDecimalsQuery'
import { TokenStakingPoolConfig } from '../../constants/token'
import { buildClaimInstruction, buildWithdrawInstruction } from '../../helpers/instructions'
import { BN } from '@project-serum/anchor'
import { buildTransaction, waitTransactionConfirm } from '@/utils'
import { getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { DataLoadFailedError, WalletNotConnectedError } from '../../helpers/errors'

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

const WithdrawDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { depositTokenName, whitelist, pool } = config

  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)
  const [claimAtSameTime, setClaimAtSameTime] = useState(true)
  const { data: userDeposits } = useUserDepositedQuery(config)
  const { data: availableRewards } = useUserAvailableRewardsQuery(pool)
  const { data: decimals } = useDepositTokenDecimalsQuery(whitelist)
  const { isMobile } = useResponsive()
  const program = useStakingProgram()
  const { data: depositTokenDecimals } = useDepositTokenDecimalsQuery(whitelist)
  const { account: user, adapter } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()

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

  const handleWithdraw = useCallback(async (callbacks: TransactionEventCallback) => {
    if (!user || !adapter) throw WalletNotConnectedError
    if (!depositTokenDecimals) throw DataLoadFailedError('depositTokenDecimals')

    const instructions: TransactionInstruction[] = []

    if (claimAtSameTime) {
      instructions.push(
        await buildClaimInstruction({ pool, user, program })
      )
    }

    const amount = new BN(new BigNumber(inputValue).shiftedBy(depositTokenDecimals).toString())
    const tokenMint = await getTokenStakingDepositTokenMint(program, config.whitelist)

    instructions.push(
      await buildWithdrawInstruction({
        amount,
        pool,
        program,
        tokenMint,
        user
      })
    )

    const transaction = await buildTransaction(program.provider, instructions)
    callbacks.onTransactionBuilt?.()

    const rawTransactions = await adapter.signAllTransactions([transaction])
    const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
    callbacks.onSent?.()

    await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
    callbacks.onConfirm?.(signatures)
  }, [user, pool, program, depositTokenDecimals, adapter, connection, inputValue])

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${depositTokenName}`}
      onSendTransaction={handleWithdraw}
      title={`Withdraw ${depositTokenName}`}
      error={inputInvalidError}
      confirmButtonProps={{ disabled: !!inputInvalidError || !inputValue.length || +inputValue <= 0 }}
    >
      <Text textAlign={'end'} mb={'8px'}>
        {'Deposited:'}
        <b className="primary" style={{ fontSize: '20px', margin: '0 4px 0 8px' }}>
          {
            userDeposits?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
        </b>
        { depositTokenName }
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
          <Text fontSize={'18px'} bold color={'primary'}>{depositTokenName}</Text>
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
            <Checkbox checked={claimAtSameTime} onChange={() => setClaimAtSameTime(b => !b)} />
          </Flex>
        )
      }
    </TransactionalDialog>
  )
}

const useWithdraw = (config: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    openModal(<WithdrawDialog config={config} />, false)
  }, [config])
}

export default useWithdraw
