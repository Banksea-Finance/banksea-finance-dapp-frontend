
import { useQuery } from 'react-query'
import { useCollectionStorageProgram } from './useCollectionStorageProgram'
import { CollectionStoragePoolAddress } from '@/hooks/programs/useCollectionStorage/constants'

const usePoolAccountQuery = () => {
  const program = useCollectionStorageProgram()

  return useQuery(
    ['COLLECTION_STORAGE_POOL_ACCOUNT'],
    () => {
      return program.account.pool.fetch(CollectionStoragePoolAddress)
    }
  )
}

export default usePoolAccountQuery
