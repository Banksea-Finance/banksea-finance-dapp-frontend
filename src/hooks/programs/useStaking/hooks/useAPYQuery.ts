import { useQuery } from 'react-query'

const useAPYQuery = () => {
  return useQuery(
    ['APY'],
    () => {
      return ''
    }
  )
}

export default useAPYQuery
