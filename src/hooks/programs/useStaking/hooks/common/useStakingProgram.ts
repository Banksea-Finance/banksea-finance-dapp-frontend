import { useMemo } from 'react'
import { Program } from '@project-serum/anchor'
import useAnchorProvider from '@/hooks/useAnchorProvider'
import { StakingProgramAddress, StakingProgramIdl } from '../../constants'

export const useStakingProgram = () => {
  const { provider } = useAnchorProvider()

  return useMemo(() => {
    return new Program(StakingProgramIdl, StakingProgramAddress, provider)
  }, [provider])
}
