import React, { useCallback, useMemo } from 'react'
import { Dialog, Text, useModal } from '@banksea-finance/ui-kit'
import { useSolanaConnectionConfig, useSolanaWeb3 } from '@/contexts'
import TransactionalDialog from '@/components/TransactionalDialog'
import { BeatLoader } from 'react-spinners'
import { useStakingProgram, useUserAvailableRewardsQuery } from '../common'
import { TokenStakingPoolConfig } from '../../constants/token'
import { BN } from '@project-serum/anchor'
import { buildClaimInstructions, buildDepositInstructions } from '../../helpers/instructions'
import { buildTransaction } from '@/utils'
import { getTokenDecimals } from '../../helpers/getters'
import { getLargestTokenAccount } from '../../helpers/accounts'
import { DataLoadFailedError } from '../../helpers/errors'
import { WalletNotConnectedError } from '@/utils/errors'

const CompoundDialog: React.FC<TokenStakingPoolConfig> = ({ depositToken, rewardToken, pool }) => {
  const { data: availableRewards, isLoading } = useUserAvailableRewardsQuery(pool)
  const { account: user } = useSolanaWeb3()
  const { connection } = useSolanaConnectionConfig()
  const program = useStakingProgram()

  const token = useMemo(() => {
    if (!depositToken.tokenMint.equals(rewardToken.tokenMint) || depositToken.name !== rewardToken.name || depositToken.icon !== rewardToken.icon)  return undefined

    return depositToken
  }, [depositToken, rewardToken])

  const handleCompound = useCallback(async () => {
    if (!user) throw WalletNotConnectedError

    if (!availableRewards) throw DataLoadFailedError('availableRewards')

    if (!token) throw new Error('Could not compound because of Deposit Token != Reward Token')

    const decimals = await getTokenDecimals(
      connection,
      token.tokenMint
    )

    const amount = new BN(availableRewards.shiftedBy(decimals).toString())

    const claimInstructions = await buildClaimInstructions({
      pool,
      user,
      program,
      amount
    })

    const depositAccount = await getLargestTokenAccount(program.provider.connection, user, token.tokenMint).then(
      account => account?.pubkey
    )

    const { instructions: depositInstructions, signers } = await buildDepositInstructions({
      amount,
      depositAccount,
      pool,
      program,
      tokenMint: token.tokenMint,
      user
    })

    return buildTransaction(program.provider, [...claimInstructions, ...depositInstructions], signers)
  }, [availableRewards, pool, user, token, connection, program])

  if (!token) {
    return (
      <Dialog title={'Compounding'}>
        <Text>CANNOT compound! Because the deposit token and reward token not the same in the pool</Text>
      </Dialog>
    )
  }

  return (
    <TransactionalDialog
      transactionName={`Compounding with ${token.name}`}
      transactionsBuilder={handleCompound}
      title={`Compounding with ${token.name}`}
      confirmButtonProps={{ disabled: isLoading || !availableRewards?.gt(0) }}
    >
      {
        isLoading ? (
          <Text textAlign={'center'} fontSize={'20px'}>
            Loading your rewards <BeatLoader size={12} />
          </Text>
        ) : availableRewards?.gt(0) ? (
          <div>
            <Text textAlign={'center'} fontSize={'20px'} mb={'16px'}>
              You have
              <b className="primary">{` ${availableRewards.toString()} ${token.name} `}</b>
              rewards available now. <br />
            </Text>
            <Text textAlign={'center'} fontSize={'20px'}>
              Would you like to harvest them all and deposit again?
            </Text>
          </div>
        ) : (
          <Text textAlign={'center'} fontSize={'20px'}>
            You have no any rewards now.
          </Text>
        )
      }
    </TransactionalDialog>
  )
}

const useCompound = (config?: TokenStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async () => {
    if (!config) return

    openModal(<CompoundDialog {...config} />, false)
  }, [config])
}

export default useCompound
