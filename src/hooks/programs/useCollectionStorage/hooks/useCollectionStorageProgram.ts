import useAnchorProvider from '@/hooks/useAnchorProvider'
import { useMemo } from 'react'
import { Program } from '@project-serum/anchor'
import {
  CollectionStorageProgramId,
  CollectionStorageProgramIdl,
  CollectionStorageProgramIdlType
} from '@/hooks/programs/useCollectionStorage/constants'

export const useCollectionStorageProgram = () => {
  const { provider } = useAnchorProvider()

  return useMemo(() => {
    return new Program<CollectionStorageProgramIdlType>(
      CollectionStorageProgramIdl,
      CollectionStorageProgramId,
      provider
    )
  }, [provider])
}
