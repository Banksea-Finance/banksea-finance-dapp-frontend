import React, { useCallback, useMemo, useState } from 'react'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useSolanaWeb3 } from '@/contexts'
import { Box, Checkbox, Flex, Input, Slider, Text, useModal, useResponsive } from '@banksea-finance/ui-kit'
import BigNumber from 'bignumber.js'
import useUserDepositedQuery from './useUserDepositedQuery'
import TransactionalDialog from '@/components/TransactionalDialog'
import { ClipLoader } from 'react-spinners'
import { useStakingProgram, useTokenDecimalsQuery, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { buildClaimInstructions, buildWithdrawInstruction } from '../../helpers/instructions'
import { BN } from '@project-serum/anchor'
import { buildTransaction } from '@/utils'
import { DataLoadFailedError } from '../../helpers/errors'
import { WalletNotConnectedError } from '@/utils/errors'
import _ from 'lodash'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const sliderMarks = _.range(0, 5).map(o => o * 25).map(o => ({ value: o, label: `${o}%` }))

const WithdrawDialog: React.FC<{ config: TokenStakingPoolConfig }> = ({ config }) => {
  const { depositToken, pool } = config

  const [inputValue, setInputValue] = useState('0')
  const [sliderValue, setSliderValue] = useState(0)
  const [claimAtSameTime, setClaimAtSameTime] = useState(true)
  const { data: userDeposits } = useUserDepositedQuery(config)
  const { data: availableRewards } = useUserAvailableRewardsQuery(pool)
  const { data: decimals } = useTokenDecimalsQuery(depositToken.tokenMint)
  const { isMobile } = useResponsive()
  const program = useStakingProgram()
  const { account: user } = useSolanaWeb3()

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

  const onSliderChange = useCallback((_event, value: number | number[]) => {
    const v = value as number

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

  const handleWithdraw = useCallback(async () => {
    if (!user) throw WalletNotConnectedError
    if (!decimals) throw DataLoadFailedError('depositTokenDecimals')

    const instructions: TransactionInstruction[] = []

    if (claimAtSameTime) {
      instructions.push(
        ...await buildClaimInstructions({ pool, user, program })
      )
    }

    const amount = new BN(new BigNumber(inputValue).shiftedBy(decimals).toString())

    instructions.push(
      ...await buildWithdrawInstruction({
        amount,
        pool,
        program,
        tokenMint: depositToken.tokenMint,
        user
      })
    )

    return buildTransaction(program.provider, instructions)
  }, [user, decimals, claimAtSameTime, pool, program, inputValue, depositToken])

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${depositToken.name}`}
      transactionsBuilder={handleWithdraw}
      title={`Withdraw ${depositToken.name}`}
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
        { depositToken.name }
      </Text>

      <Input
        scale={'M'}
        disabled={userDeposits?.lte(0)}
        value={inputValue}
        autoFocus
        onChange={onInputChange}
        mr={'4px'}
        mb={'8px'}
        endAdornment={
          <Text fontSize={'18px'} bold color={'primary'}>{depositToken.name}</Text>
        }
      />

      <Box width={'80%'} ml={'10%'} mb={'32px'}>
        <Slider
          tooltip
          disabled={userDeposits?.lte(0)}
          value={sliderValue}
          onChange={onSliderChange}
          marks={sliderMarks}
        />
      </Box>

      {
        availableRewards?.gt(0) && (
          <Flex ai={'center'} justifyContent={'space-between'}>
            <Text fontSize={'16px'} maxWidth={isMobile ? '85%' : undefined} as={'span'}>
              Harvest the rewards of {availableRewards?.toFixed(6)} {config.rewardToken.name} at the same time
            </Text>
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
