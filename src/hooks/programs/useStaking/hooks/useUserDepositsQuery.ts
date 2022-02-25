import { useMemo } from 'react'
import { numberWithCommas } from '@/utils'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import usePassbookAccountQuery from './usePassbookAccountQuery'

const useUserDepositsQuery = (poolAddress: PublicKey) => {
  const { data: passbookAccount } = usePassbookAccountQuery(poolAddress)

  return useMemo(() => {
    if (!passbookAccount) {
      return '-'
    }

    return numberWithCommas((passbookAccount?.account?.stakingAmount.toNumber() || 0) / LAMPORTS_PER_SOL)
  }, [passbookAccount])
}

export default useUserDepositsQuery
