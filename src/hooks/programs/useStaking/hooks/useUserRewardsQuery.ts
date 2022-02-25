import { useQuery } from 'react-query'

const useUserRewardsQuery = () => {
  return useQuery(
    ['UserRewards'],
    () => {
      return ''
    }
  )
}

export default useUserRewardsQuery
