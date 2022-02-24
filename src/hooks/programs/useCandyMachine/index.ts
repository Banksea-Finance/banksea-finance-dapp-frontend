import { useCallback, useMemo } from 'react'
import { Program } from '@project-serum/anchor'
import { CANDY_MACHINE_PROGRAM_ID, CANDY_MACHINE_PROGRAM_IDL } from './helpers/constant'
import useAnchorProvider from '@/hooks/useAnchorProvider'
import { mint as mintFromCandyMachine } from '@/hooks/programs/useCandyMachine/helpers/mint'
import { Keypair } from '@solana/web3.js'

const useCandyMachine = () => {
  const provider = useAnchorProvider()

  const program = useMemo(() => {
    if (!provider) {
      return undefined
    }

    return new Program(CANDY_MACHINE_PROGRAM_IDL, CANDY_MACHINE_PROGRAM_ID, provider)
  }, [provider])

  const ready = useMemo(() => !!program, [program])

  const mint = useCallback(async (mintKeypair: Keypair) => {
    if (!program) {
      return Promise.reject('Program not ready')
    }

    return await mintFromCandyMachine(program, mintKeypair)
  }, [program])

  return {
    program, mint, ready
  }
}

export default useCandyMachine
