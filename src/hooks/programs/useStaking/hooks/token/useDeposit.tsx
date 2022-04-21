import React, { useCallback, useMemo, useState } from 'react'
import { useModal, useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Input, Text } from '@/contexts/theme/components'
import BigNumber from 'bignumber.js'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { BN } from '@project-serum/anchor'
import { buildTransaction, waitTransactionConfirm } from '@/utils'
import { useStakingProgram } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import usePoolBalanceQuery from './usePoolBalanceQuery'
import { getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { buildDepositInstructions, buildRegisterInstruction } from '../../helpers/instructions'
import { getLargestTokenAccount } from '../../helpers/accounts'
import useDepositTokenDecimalsQuery from './useDepositTokenDecimalsQuery'
import { WalletNotConnectedError, DataLoadFailedError } from '../../helpers/errors'

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider)

const markNode = (number: number) => ({ style: { width: '8px' }, label: `${number}%` })

const sliderMarks = {
  0: markNode(0),
  25: markNode(25),
  50: markNode(50),
  75: markNode(75),
  100: markNode(100)
}

const DepositDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { pool, whitelist, depositTokenName } = config

  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)

  const { data: poolBalance } = usePoolBalanceQuery(config)

  const { account: user, adapter } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const { data: depositTokenDecimals } = useDepositTokenDecimalsQuery(whitelist)

  const inputInvalidError = useMemo(() => {
    if (!inputValue || !depositTokenDecimals) {
      return
    }

    if (new BigNumber(inputValue).isNaN()) {
      return 'The input is not a number'
    }

    if ((/\d+\.(\d+)/.exec(inputValue)?.[1]?.length || 0) > depositTokenDecimals) {
      return `Decimal places too large (maximum: ${depositTokenDecimals})`
    }
  }, [inputValue, depositTokenDecimals])

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

  const handleDeposit = useCallback(async (callbacks: TransactionEventCallback) => {
    if (!user || !adapter) throw WalletNotConnectedError
    if (!depositTokenDecimals) throw DataLoadFailedError('depositTokenDecimals')

    const amount = new BN(new BigNumber(inputValue).shiftedBy(depositTokenDecimals).toString())

    const registerInstruction = await buildRegisterInstruction({
      user,
      program,
      pool
    })

    const depositTokenMint = await getTokenStakingDepositTokenMint(program, config.whitelist)
    const depositAccount = await getLargestTokenAccount(program.provider.connection, user, depositTokenMint).then(acc => acc?.pubkey)

    const { instructions: depositInstructions, signers } = await buildDepositInstructions({
      amount,
      depositAccount,
      pool,
      program,
      tokenMint: depositTokenMint,
      user,
      whitelist
    })

    const transaction = await buildTransaction(program.provider, [registerInstruction, ...depositInstructions], signers)
    callbacks.onTransactionBuilt?.()

    const rawTransactions = await adapter.signAllTransactions([transaction])
    const signatures = await Promise.all(rawTransactions.map(tx => connection.sendRawTransaction(tx.serialize())))
    callbacks.onSent?.()

    await Promise.all(signatures.map(signature => waitTransactionConfirm(connection, signature)))
    callbacks.onConfirm?.(signatures)
  }, [inputValue, depositTokenDecimals, user, pool, whitelist, adapter, connection])

  return (
    <TransactionalDialog
      transactionName={`Deposit ${depositTokenName}`}
      onSendTransaction={handleDeposit}
      title={`Deposit ${depositTokenName}`}
      error={inputInvalidError}
      confirmButtonProps={{ disabled: !!inputInvalidError || !inputValue.length || +inputValue <= 0 }}
    >
      <Text textAlign={'end'} mb={'8px'}>
        {'Your Balance:'}
        <b className="primary" style={{ fontSize: '20px', margin: '0 4px 0 8px' }}>
          {
            poolBalance?.toString() || <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
          }
        </b>
        { depositTokenName }
      </Text>
      <Input
        scale={'M'}
        autoFocus
        value={inputValue}
        allowClear
        onChange={onInputChange}
        mr={'4px'}
        mb={'8px'}
        style={{ flexGrow: 1 }}
        suffix={
          <Text fontSize={'18px'} bold color={'primary'}>{depositTokenName}</Text>
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

const useDeposit = (config?: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!config) return

    openModal(<DepositDialog config={config} />, false)
  }, [config])
}

export default useDeposit
