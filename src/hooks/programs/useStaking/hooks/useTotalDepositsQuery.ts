import { useMemo } from 'react'
import { numberWithCommas } from '@/utils'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { usePoolAccountQuery } from '@/hooks/programs/useStaking/hooks/index'

const useUserDepositsQuery = (poolAddress: PublicKey) => {
  const { data: poolAccount } = usePoolAccountQuery(poolAddress)

  return useMemo(() => {
    if (!poolAccount) return '-'

    return numberWithCommas(poolAccount.totalStakingAmount.toNumber() / LAMPORTS_PER_SOL)
  }, [poolAccount])
}

export default useUserDepositsQuery
