import React, { useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useModal, useSolanaWeb3 } from '@/contexts'
import { Card } from '@/contexts/theme/components'
import { Staker } from '@/hooks/programs/useStaking/helpers/Staker'
import { BN } from '@project-serum/anchor'
import { useStakingProgram } from '../hooks'

export type UseTokenDepositProps = {
  poolAddress: PublicKey
  whitelistAddress?: PublicKey
}

const DepositTokenProcessTips = {
  checkingPassbook: 'Checking your passbook...',
  failedToCheckPassbook: (e: any) => `Failed to check passbook. (${e.message || e.toString()})`,
  passbookNotExist: (
    <>
      <p>Passbook not found by your account.</p>
      <p> Please approve in your wallet to create a new one!</p>
    </>
  ),
  passbookRegisterSuccess: 'Your passbook has registered successfully!',
}

const useTokenDeposit = (props: UseTokenDepositProps) => {
  const { program } = useStakingProgram()
  const { account } = useSolanaWeb3()
  const { openModal, configModal } = useModal()
  const { poolAddress, whitelistAddress } = props

  return useCallback(
    async () => {
      if (!program || !account || !poolAddress || !whitelistAddress) return

      configModal({
        contentWrapper: <Card p={'128px'} style={{ lineHeight: '48px', textAlign: 'center' }} />
      })


      openModal(DepositTokenProcessTips.checkingPassbook)

      const staker = new Staker(program, poolAddress, account, account)

      staker.deposit(whitelistAddress, new BN(1e9))

      // configModal({
      //   contentWrapper: undefined
      // })
    },
    [program, account, poolAddress, whitelistAddress]
  )
}

export default useTokenDeposit
