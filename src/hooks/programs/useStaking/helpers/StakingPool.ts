import { BN, Program } from '@project-serum/anchor'
import { Keypair, PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js'
import { Staker } from './Staker'
import { Token } from '@solana/spl-token'
import { StakingProgramIdlType } from '@/hooks/programs/useStaking/constants'

export enum WhiteListFormat {
  Mint = 0,
  Creator = 1
}

export class StakingPool {
  pool!: PublicKey

  rewardToken!: Token
  rewardAccount!: PublicKey

  authority!: Keypair
  program!: Program<StakingProgramIdlType>
  stakerMap!: Map<string, Staker>

  rewardSigner!: PublicKey
  stakingSigner!: PublicKey


  static async create(program: Program<StakingProgramIdlType>, authority: Keypair,
    rewardToken: Token, rewardPerSlot: BN, rewardEndSlot: BN): Promise<StakingPool> {
    const stakingPool = new StakingPool()

    stakingPool.authority = authority
    stakingPool.program = program
    stakingPool.stakerMap = new Map<string, Staker>()

    const poolKeypair = Keypair.generate()

    const [rewardSigner, rewardSignerBump] = await PublicKey.findProgramAddress(
      [Buffer.from('reward_signer'), poolKeypair.publicKey.toBuffer()],
      stakingPool.program.programId
    )
    const [stakingSigner, stakingSignerBump] = await PublicKey.findProgramAddress(
      [Buffer.from('staking_signer'), poolKeypair.publicKey.toBuffer()],
      stakingPool.program.programId
    )

    stakingPool.rewardSigner = rewardSigner
    stakingPool.stakingSigner = stakingSigner

    stakingPool.rewardToken = rewardToken
    stakingPool.rewardAccount = await rewardToken.createAccount(rewardSigner)

    stakingPool.pool = poolKeypair.publicKey

    await stakingPool.program.rpc.create(rewardPerSlot, rewardEndSlot, rewardSignerBump, stakingSignerBump, {
      accounts: {
        pool: stakingPool.pool,
        rewardSigner,
        rewardMint: stakingPool.rewardToken.publicKey,
        rewardAccount: stakingPool.rewardAccount,
        stakingSigner,
        authority: stakingPool.authority.publicKey,
        payer: stakingPool.program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
      signers: [poolKeypair, stakingPool.authority],
    })

    return stakingPool
  }

  async addWhitelist(format: number, addr: PublicKey, weight: BN): Promise<PublicKey> {
    const [newWhitelist, whitelistBump] = await PublicKey.findProgramAddress(
      [Buffer.from('whitelist'), this.pool.toBuffer(), addr.toBuffer()],
      this.program.programId
    )

    await this.program.rpc.addWhitelist(format, addr, weight, whitelistBump, {
      accounts: {
        pool: this.pool,
        whitelist: newWhitelist,
        authority: this.authority.publicKey,
        payer: this.program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [this.authority],
    })
    return newWhitelist
  }

  async setRewardRate(rewardPerSlot: BN): Promise<number> {
    const tx = await this.program.rpc.setRewardRate(rewardPerSlot, {
      accounts: {
        pool: this.pool,
        authority: this.authority.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
      signers: [this.authority],
    })
    await this.program.provider.connection.confirmTransaction(tx)
    const tr = await this.program.provider.connection.getTransaction(tx, { commitment: 'confirmed' })

    return tr!.slot
  }

  async setEndding(endSlot: BN) {
    await this.program.rpc.setEnddingSlot(endSlot, {
      accounts: {
        pool: this.pool,
        authority: this.authority.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
      signers: [this.authority],
    })
  }

  /*async addStaker(user: Keypair): Promise<Staker> {
    const rewardWallet = (await this.rewardToken.getOrCreateAssociatedAccountInfo(user.publicKey)).address
    const staker = await Staker.create(this.program, this.pool, user, rewardWallet)
    this.stakerMap.set(user.publicKey.toString(), staker)

    return staker
  }*/

  staker(user: PublicKey): Staker {
    return this.stakerMap.get(user.toString())!
  }
}
