import { Keypair, PublicKey, Signer, SystemProgram, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { getAsset, getLargestTokenAccount, getPassbook } from './accounts'
import { BN, Program } from '@project-serum/anchor'
import { createTokenAccountInstrs } from '@project-serum/common'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { StakingProgramIdlType } from '../constants'
import { DataLoadFailedError } from './errors'
import { getOrCreateTokenAccount } from '@/utils'

export type BuildRegisterInstructionProps = {
  user: PublicKey
  program: Program<StakingProgramIdlType>
  pool: PublicKey
}

export async function buildRegisterInstruction(
  props: BuildRegisterInstructionProps
): Promise<TransactionInstruction | undefined> {
  const { user, program, pool } = props

  const passbook = await getPassbook(props)

  if (passbook.account) {
    return undefined
  }

  return program.instruction.register(passbook.bump, {
    accounts: {
      passbook: passbook.address,
      pool,
      user,
      payer: user,
      systemProgram: SystemProgram.programId
    }
  })
}

export type BuildDepositInstructionsProps = {
  user: PublicKey
  pool: PublicKey
  depositAccount?: PublicKey | (() => Promise<PublicKey | undefined>)
  tokenMint: PublicKey
  program: Program<StakingProgramIdlType>
  metadata?: PublicKey
  amount?: BN
}

export async function buildDepositInstructions(
  props: BuildDepositInstructionsProps
): Promise<{ instructions: TransactionInstruction[], signers: Signer[] }> {
  const { user, tokenMint, metadata, program, pool, depositAccount: _depositAccount, amount = new BN(1) } = props
  const instructions: TransactionInstruction[] = []

  const depositAccount = typeof _depositAccount === 'function' ? await _depositAccount() : _depositAccount

  if (!depositAccount) {
    throw DataLoadFailedError('depositAccount')
  }

  const newStakingAccount = Keypair.generate()

  const { address: passbook } = (await getPassbook(props))!

  // check asset or add
  const { assetAddress: asset, assetBump, assetAccount } = await getAsset({ passbook, tokenMint, program })

  const [whitelist] = await PublicKey.findProgramAddress(
    [Buffer.from('whitelist'), pool.toBuffer(), tokenMint.toBuffer()],
    program.programId
  )

  if (!assetAccount) {
    const [stakingSigner, stakingSignerBump] = await PublicKey.findProgramAddress(
      [Buffer.from('staking_signer'), passbook.toBuffer(), tokenMint.toBuffer()],
      program.programId
    )

    const createTokenAccountInstructions = await createTokenAccountInstrs(
      program.provider,
      newStakingAccount.publicKey,
      tokenMint,
      stakingSigner
    )

    const addAssetInstruction = await program.instruction.addAsset(assetBump, stakingSignerBump, {
      accounts: {
        pool,
        passbook,
        asset,
        whitelist,
        stakingAccount: newStakingAccount.publicKey,
        stakingSigner,
        user,
        payer: user,
        systemProgram: SystemProgram.programId
      },
      remainingAccounts: metadata ? [{
        pubkey: metadata,
        isWritable: false,
        isSigner: false
      }] : undefined
    })

    instructions.push(...createTokenAccountInstructions)

    instructions.push(addAssetInstruction)
  }

  instructions.push(
    await program.instruction.deposit(amount, {
      accounts: {
        pool,
        passbook,
        asset,
        depositAccount,
        user,
        tokenProgram: TOKEN_PROGRAM_ID,
        stakingAccount: assetAccount?.stakingAccount || newStakingAccount.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })
  )

  const signers = assetAccount ? [] : [newStakingAccount]

  return { instructions, signers }
}

export type BuildWithdrawInstructionProps = {
  pool: PublicKey
  user: PublicKey
  tokenMint: PublicKey
  program: Program<StakingProgramIdlType>
  amount?: BN
}

export async function buildWithdrawInstruction(props: BuildWithdrawInstructionProps) {
  const { tokenMint, pool, user, program, amount = new BN(1) } = props

  const { address: passbook } = await getPassbook(props)

  const largestTokenAccount = await getLargestTokenAccount(program.provider.connection, user, tokenMint)

  if (!largestTokenAccount) throw DataLoadFailedError('largestTokenAccount')

  const { pubkey: withdrawAccount } = largestTokenAccount

  const [asset] = await PublicKey.findProgramAddress(
    [Buffer.from('asset'), passbook.toBuffer(), tokenMint.toBuffer()],
    program.programId
  )

  const { stakingAccount, stakingSigner } = await program.account.asset.fetch(asset)

  return program.instruction.withdraw(amount, {
    accounts: {
      pool,
      passbook,
      asset,
      withdrawAccount,
      stakingSigner,
      stakingAccount,
      user,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY
    }
  })
}

export type BuildClaimInstructionProps = {
  pool: PublicKey
  user: PublicKey
  program: Program<StakingProgramIdlType>
  amount?: BN
}

export async function buildClaimInstructions(props: BuildClaimInstructionProps): Promise<TransactionInstruction[]> {
  const { program, pool, user, amount } = props

  const { rewardAccount, rewardMint } = await program.account.pool.fetch(pool)

  const [rewardSigner] = await PublicKey.findProgramAddress(
    [Buffer.from('reward_signer'), pool.toBuffer()],
    program.programId
  )

  const { address: passbook } = await getPassbook(props)

  const {
    instruction: createRewardTokenAccountInstruction,
    pubkey: rewardTokenAccountAddress
  } = await getOrCreateTokenAccount(program.provider.connection, rewardMint, user, 'largest')

  const instructions: TransactionInstruction[] = []

  if (createRewardTokenAccountInstruction) {
    instructions.push(createRewardTokenAccountInstruction)
  }

  instructions.push(await program.instruction.claim(amount || null, {
    accounts: {
      passbook,
      pool,
      claimAccount: rewardTokenAccountAddress,
      rewardSigner,
      rewardAccount,
      user,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY
    }
  }))

  return instructions
}
