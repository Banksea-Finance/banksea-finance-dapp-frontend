import { PublicKey, Signer, Transaction, TransactionInstruction } from '@solana/web3.js'
import { chunk } from '@/utils'
import { Program } from '@project-serum/anchor'
import { getLargestTokenAccount } from './accounts'
import { StakingProgramIdlType } from '../constants'
import { buildDepositInstructions } from './instructions'

export type BuildDepositNFTsTransactionsProps = {
  tokens: Array<{ tokenMint: PublicKey; metadata: PublicKey }>

  user: PublicKey
  pool: PublicKey
  program: Program<StakingProgramIdlType>
}

export async function buildDepositNFTsTransactions(props: BuildDepositNFTsTransactionsProps): Promise<Transaction[]> {
  const { tokens, program, user } = props

  if (tokens.length > 2) {
    const tokenChunks = chunk(tokens, 2)
    return (await Promise.all(tokenChunks.map(tokens => buildDepositNFTsTransactions({ ...props, tokens })))).flat()
  }

  const depositInstructionsAndSigners: Array<{
    instructions: TransactionInstruction[]
    signers: Signer[]
  }> = await Promise.all(
    tokens.map(({ tokenMint, metadata }) => buildDepositInstructions({
      ...props,
      tokenMint,
      metadata,
      depositAccount: () => getLargestTokenAccount(program.provider.connection, user, tokenMint).then(acc => acc?.pubkey)
    }))
  )

  const instructions = [...depositInstructionsAndSigners.map(o => o.instructions).flat()]
  const signers = depositInstructionsAndSigners.map(o => o.signers).flat()

  const tx = new Transaction({
    recentBlockhash: (await program.provider.connection.getLatestBlockhash()).blockhash,
    feePayer: user
  })

  tx.add(...instructions)
  tx.sign(...signers)

  return [tx]
}
