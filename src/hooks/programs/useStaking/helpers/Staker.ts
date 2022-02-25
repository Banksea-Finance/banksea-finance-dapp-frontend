import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Keypair, PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY, Transaction } from '@solana/web3.js'
import { StakingProgramIdlType } from '@/hooks/programs/useStaking/constants'
import { BN, Program } from '@project-serum/anchor'
import { getAsset, getPassbook } from '@/hooks/programs/useStaking/helpers/accounts'
import { getAssociatedTokenAddress } from '@project-serum/associated-token'
import { createTokenAccountInstrs } from '@project-serum/common'

export class Staker {
  user!: PublicKey
  program!: Program<StakingProgramIdlType>
  pool!: PublicKey
  stakingSigner!: PublicKey
  rewardWallet!: PublicKey

  constructor(program: Program<StakingProgramIdlType>, pool: PublicKey, user: PublicKey, rewardWallet: PublicKey) {
    this.user = user
    this.program = program
    this.pool = pool
    this.rewardWallet = rewardWallet
  }

  /* static async create(
    program: Program<StakingProgramIdlType>,
    pool: PublicKey,
    user: Keypair,
    rewardWallet: PublicKey
  ): Promise<Staker> {
    const staker = new Staker()
    staker.user = user
    staker.program = program
    staker.pool = pool
    staker.rewardWallet = rewardWallet

    const [passbook, passbookBump] = await PublicKey.findProgramAddress(
      [Buffer.from('passbook'), pool.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    )

    staker.stakingSigner = (
      await PublicKey.findProgramAddress([Buffer.from('staking_signer'), pool.toBuffer()], program.programId)
    )[0]

    staker.passbook = passbook

    await program.rpc.register(passbookBump, {
      accounts: {
        passbook,
        pool: pool,
        user: user.publicKey,
        payer: program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [user]
    })

    return staker
  }*/

  async deposit(whitelist: PublicKey, depositAmount: BN) {
    const tokenMint = (await this.program.account.pool.fetch(this.pool)).rewardMint

    const depositAccountAddress = await getAssociatedTokenAddress(this.user, tokenMint)
    const depositAccount = await this.program.provider.connection.getParsedAccountInfo(depositAccountAddress)

    if (!depositAccount) {
      throw new Error('insufficient balance')
    }

    const newStakingAccount = Keypair.generate()
    const tx = new Transaction()

    // *****************************************************************************
    // check passbook or register
    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    if (!passbook.account) {
      tx.add(
        await this.program.instruction.register(passbook.bump, {
          accounts: {
            passbook: passbook.address,
            pool: this.pool,
            user: this.user,
            payer: this.program.provider.wallet.publicKey,
            systemProgram: SystemProgram.programId
          }
        })
      )
    }

    // *****************************************************************************
    // check asset or add
    const { assetAddress, assetBump, assetAccount } = await getAsset({
      passbook: passbook.address,
      tokenMint,
      program: this.program
    })

    if (!assetAccount) {
      const stakingSigner = (
        await PublicKey.findProgramAddress(
          [Buffer.from('staking_signer'), this.pool.toBuffer()],
          this.program.programId
        )
      )[0]

      const createTokenAccountInstructions = await createTokenAccountInstrs(
        this.program.provider,
        newStakingAccount.publicKey,
        tokenMint,
        stakingSigner
      )

      const addAssetInstruction = await this.program.instruction.addAsset(assetBump, {
        accounts: {
          pool: this.pool,
          passbook: passbook.address,
          asset: assetAddress,
          whitelist,
          stakingAccount: newStakingAccount.publicKey,
          user: this.user,
          payer: this.program.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      })

      tx.add(...createTokenAccountInstructions).add(addAssetInstruction)
    }

    const depositInstruction = await this.program.instruction.deposit(depositAmount, {
      accounts: {
        pool: this.pool,
        passbook: passbook.address,
        asset: assetAddress,
        depositAccount: depositAccountAddress,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        stakingAccount: assetAccount?.stakingAccount || newStakingAccount.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })

    tx.add(depositInstruction)

    await this.program.provider.send(tx, assetAccount ? [] : [newStakingAccount])
  }

  /*async claim(claimAmount: BN): Promise<number> {
    const poolAccount = await this.program.account.pool.fetch(this.pool)

    const [rewardSigner] = await PublicKey.findProgramAddress(
      [Buffer.from('reward_signer'), this.pool.toBuffer()],
      this.program.programId
    )

    const tx = await this.program.rpc.claim(claimAmount, {
      accounts: {
        passbook: this.passbook,
        pool: this.pool,
        claimAccount: this.rewardWallet,
        rewardSigner,
        rewardAccount: poolAccount.rewardAccount,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })

    await this.program.provider.connection.confirmTransaction(tx)
    const tr = await this.program.provider.connection.getTransaction(tx, { commitment: 'confirmed' })

    return tr!.slot
  }

  async withdraw(mint: PublicKey, withdrawAccount: PublicKey, withdrawAmount: BN): Promise<number> {
    const [asset] = await PublicKey.findProgramAddress(
      [Buffer.from('asset'), this.passbook.toBuffer(), mint.toBuffer()],
      this.program.programId
    )

    const assetAccount = await this.program.account.asset.fetch(asset)

    const tx = await this.program.rpc.withdraw(withdrawAmount, {
      accounts: {
        pool: this.pool,
        passbook: this.passbook,
        asset,
        withdrawAccount,
        stakingSigner: this.stakingSigner,
        stakingAccount: assetAccount.stakingAccount,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })

    await this.program.provider.connection.confirmTransaction(tx)
    const tr = await this.program.provider.connection.getTransaction(tx, { commitment: 'confirmed' })

    return tr!.slot
  }

  async getRewardAmount(slot: number): Promise<BN> {
    const poolAccount = await this.program.account.pool.fetch(this.pool)

    const passbookAccount = await this.program.account.passbook.fetch(this.passbook)

    let rewardSlot = slot

    // check it is endding
    if (!poolAccount.endSlot.eqn(0)) {
      rewardSlot = slot < poolAccount.endSlot.toNumber() ? slot : poolAccount.endSlot.toNumber()
    }

    const curSlot = new BN(rewardSlot)
    const multiple = new BN((1e18).toString())
    let factor = new BN(0)
    if (!poolAccount.totalStakingAmount.eqn(0)) {
      factor = curSlot
        .sub(poolAccount.lastAccSlot)
        .mul(poolAccount.rewardPerSlot)
        .mul(multiple)
        .div(poolAccount.totalStakingAmount)
    }
    factor = factor.add(poolAccount.lastAccRewardFactor as BN).sub(passbookAccount.lastAccRewardFactor as BN)

    const IncRewardAmount = factor.mul(passbookAccount.stakingAmount).div(multiple)

    return passbookAccount.rewardAmount.add(IncRewardAmount)
  }

  async getClaimAmount(slot: number): Promise<BN> {
    const passbookAccount = await this.program.account.passbook.fetch(this.passbook)

    const rewardAmount = await this.getRewardAmount(slot)
    return rewardAmount.sub(passbookAccount.claimedAmount)
  }

  async stakingAccount(mint: PublicKey): Promise<PublicKey> {
    const [asset] = await PublicKey.findProgramAddress(
      [Buffer.from('asset'), this.passbook.toBuffer(), mint.toBuffer()],
      this.program.programId
    )

    const assetAccount = await this.program.account.asset.fetch(asset)

    return assetAccount.stakingAccount
  }

  async printAllAssets() {
    const filter = [
      {
        memcmp: {
          offset: 8, //need to prepend 8 bytes for anchor's disc
          bytes: this.passbook.toBase58()
        }
      }
    ]
    const assets = await this.program.account.asset.all(filter)
    console.log(assets)
  }*/
}
