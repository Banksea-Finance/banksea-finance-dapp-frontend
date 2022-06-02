import React, { useCallback, useMemo, useState } from 'react'
import { useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import { Box, Input, Slider, Text, useModal } from '@banksea-finance/ui-kit'
import BigNumber from 'bignumber.js'
import TransactionalDialog from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import { BN } from '@project-serum/anchor'
import { buildTransaction } from '@/utils'
import { useStakingProgram } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import usePoolBalanceQuery from './usePoolBalanceQuery'
import { getTokenStakingDepositTokenMint } from '../../helpers/getters'
import { buildDepositInstructions, buildRegisterInstruction } from '../../helpers/instructions'
import { getLargestTokenAccount } from '../../helpers/accounts'
import useDepositTokenDecimalsQuery from './useDepositTokenDecimalsQuery'
import { DataLoadFailedError } from '../../helpers/errors'
import { WalletNotConnectedError } from '@/utils/errors'
import _ from 'lodash'

const sliderMarks = _.range(0, 5)
  .map(o => o * 25)
  .map(o => ({ value: o, label: `${o}%` }))

const DepositDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { pool, whitelist, depositTokenName } = config

  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)

  const { data: poolBalance } = usePoolBalanceQuery(config)

  const { account: user } = useSolanaWeb3()

  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const { data: depositTokenDecimals } = useDepositTokenDecimalsQuery(whitelist)

  const inputInvalidError = useMemo(() => {
    if (!inputValue || !depositTokenDecimals) {
      return
    }

    if (new BigNumber(inputValue.replace(/(\d)[, ](\d)/g, '$1$2')).isNaN()) {
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

  const onSliderChange = useCallback((_event, value: number | number[]) => {
    const v = value as number

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

  const handleDeposit = useCallback(async () => {
    if (!user) throw WalletNotConnectedError
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
    })

    return buildTransaction(program.provider, [registerInstruction, ...depositInstructions], signers)
  }, [inputValue, depositTokenDecimals, user, pool, whitelist, connection])

  return (
    <TransactionalDialog
      transactionName={`Deposit ${depositTokenName}`}
      transactionsBuilder={handleDeposit}
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
        onChange={onInputChange}
        mr={'4px'}
        mb={'8px'}
        style={{ flexGrow: 1 }}
        endAdornment={
          <Text fontSize={'18px'} bold color={'primary'}>{depositTokenName}</Text>
        }
      />

      <Box width={'80%'} ml={'10%'}>
        <Slider
          tooltip
          disabled={poolBalance?.lte(0)}
          value={sliderValue}
          onChange={onSliderChange}
          marks={sliderMarks}
        />
      </Box>
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
