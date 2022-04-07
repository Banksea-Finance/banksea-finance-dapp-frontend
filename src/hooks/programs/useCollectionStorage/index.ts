import { useDeposit, useUserDepositedQuery } from './hooks'
import usePoolAccountQuery from '@/hooks/programs/useCollectionStorage/hooks/usePoolAccountQuery'

export const useCollectionStorage = () => {
  return {
    deposit: useDeposit(),
    userDeposited: useUserDepositedQuery(),
    poolAccount: usePoolAccountQuery().data
  }
}
