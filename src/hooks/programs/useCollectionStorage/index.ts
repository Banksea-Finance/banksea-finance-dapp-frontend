import { useDeposit, useUserDepositedQuery } from './hooks'
import usePoolAccountQuery from '@/hooks/programs/useCollectionStorage/hooks/usePoolAccountQuery'
import useWithdraw from '@/hooks/programs/useCollectionStorage/hooks/useWithdraw'

export const useCollectionStorage = () => {
  return {
    deposit: useDeposit(),
    withdraw: useWithdraw(),
    userDeposited: useUserDepositedQuery(),
    poolAccount: usePoolAccountQuery().data
  }
}
