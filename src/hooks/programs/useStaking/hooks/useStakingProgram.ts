import { useMemo } from 'react'
import { Program } from '@project-serum/anchor'
import { StakingProgramAddress, StakingProgramIdl } from '@/hooks/programs/useStaking/constants/global'
import useAnchorProvider from '@/hooks/useAnchorProvider'

const useStakingProgram = () => {
  const provider = useAnchorProvider()

  const program = useMemo(() => {
    if (!provider) {
      return undefined
    }

    return new Program(StakingProgramIdl, StakingProgramAddress, provider)
  }, [provider])

  return {
    program
  }
}

export default useStakingProgram
