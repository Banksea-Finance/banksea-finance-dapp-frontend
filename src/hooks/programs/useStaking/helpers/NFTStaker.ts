import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  AccountInfo,
  Keypair,
  ParsedAccountData,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Transaction
} from '@solana/web3.js'
import { StakingProgramIdlType } from '@/hooks/programs/useStaking/constants'
import { BN, Program, ProgramAccount } from '@project-serum/anchor'
import { getAsset, getPassbook, Passbook } from '@/hooks/programs/useStaking/helpers/accounts'
import { createTokenAccountInstrs } from '@project-serum/common'
import BigNumber from 'bignumber.js'
import { AccountFromIDL } from '@/utils/types'
import { waitTransactionConfirm } from '@/utils'
import { TransactionEventCallback } from '@/components/transactional-dialog'

export class NFTStaker {
  poolName: string
  user?: PublicKey
  program: Program<StakingProgramIdlType>
  pool: PublicKey
  whitelist: PublicKey
  rewardTokenName: string

  _poolAccount?: AccountFromIDL<StakingProgramIdlType, 'pool'>
  _rewardTokenDecimals?: number

  constructor(props: {
    program: Program<StakingProgramIdlType>
    poolName: string
    poolAddress: PublicKey
    user?: PublicKey
    whitelist: PublicKey
    rewardTokenName: string
  }) {
    const { poolAddress, program, whitelist, user, poolName, rewardTokenName } = props

    this.poolName = poolName
    this.user = user
    this.program = program
    this.pool = poolAddress
    this.whitelist = whitelist
    this.rewardTokenName = rewardTokenName
  }

  async deposit(tokenMint: PublicKey, metadata: PublicKey, callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const depositAccount = (await this.getTokenAccount(tokenMint))!

    const newStakingAccount = Keypair.generate()
    const tx = new Transaction()

    // check passbook or register
    const passbook = (await this.getPassbook())!

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

    // check asset or add
    const { assetAddress, assetBump, assetAccount } = await getAsset({
      passbook: passbook.address,
      tokenMint,
      program: this.program
    })

    if (!assetAccount) {
      const [stakingSigner, stakingSignerBump] = await PublicKey.findProgramAddress(
        [Buffer.from('staking_signer'), passbook.address.toBuffer(), tokenMint.toBuffer()],
        this.program.programId
      )

      const createTokenAccountInstructions = await createTokenAccountInstrs(
        this.program.provider,
        newStakingAccount.publicKey,
        tokenMint,
        stakingSigner
      )

      const remainingAccounts = [
        {
          pubkey: metadata,
          isWritable: false,
          isSigner: false
        }
      ]

      const addAssetInstruction = await this.program.instruction.addAsset(assetBump, stakingSignerBump, {
        accounts: {
          pool: this.pool,
          passbook: passbook.address,
          asset: assetAddress,
          whitelist: this.whitelist,
          stakingAccount: newStakingAccount.publicKey,
          stakingSigner,
          user: this.user,
          payer: this.program.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        remainingAccounts
      })

      tx.add(...createTokenAccountInstructions).add(addAssetInstruction)
    }

    const depositInstruction = await this.program.instruction.deposit(new BN(1), {
      accounts: {
        pool: this.pool,
        passbook: passbook.address,
        asset: assetAddress,
        depositAccount: depositAccount.pubkey,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        stakingAccount: assetAccount?.stakingAccount || newStakingAccount.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })

    tx.add(depositInstruction)
    callback?.onTransactionBuilt?.()

    const signature = await this.program.provider.send(tx, assetAccount ? [] : [newStakingAccount])
    callback?.onSent?.()

    await waitTransactionConfirm(this.program.provider.connection, signature)
    callback?.onConfirm?.(signature)
  }

  /**
   *
   * @param tokenMint The mint of NFT to withdraw
   * @param claim If claim the rewards at the same or not
   * @param callback
   */
  async withdraw(tokenMint: PublicKey, claim?: boolean, callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const tx = new Transaction()

    if (claim) {
      tx.add((await this._buildClaimInstruction())!)
    }
    tx.add((await this._buildWithdrawInstruction(tokenMint))!)
    callback?.onTransactionBuilt?.()

    const signature = await this.program.provider.send(tx)
    callback?.onSent?.()

    await waitTransactionConfirm(this.program.provider.connection, signature)
    callback?.onConfirm?.(signature)
  }

  async claim(callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const tx = new Transaction().add((await this._buildClaimInstruction())!)
    callback?.onTransactionBuilt?.()

    const signature = await this.program.provider.send(tx)
    callback?.onSent?.()

    await waitTransactionConfirm(this.program.provider.connection, signature)
    callback?.onConfirm?.(signature)
  }

  async getHistoryTotalRewards(): Promise<BigNumber | undefined> {
    if (!this.user) return undefined

    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    })

    if (!passbook.account) {
      return new BigNumber(0)
    }

    const poolAccount = await this.getPoolAccount(true)

    const slot = await this.program.provider.connection.getSlot('confirmed')

    const currentSeconds = (await this.program.provider.connection.getBlockTime(slot))!

    let rewardSlot = currentSeconds

    // check it is ending
    if (!poolAccount.endSec.eqn(0)) {
      rewardSlot = currentSeconds < poolAccount.endSec.toNumber() ? currentSeconds : poolAccount.endSec.toNumber()
    }

    const curSlot = new BN(rewardSlot)
    const multiple = new BN((1e18).toString())
    let factor = new BN(0)

    if (!poolAccount.totalStakingAmount.eqn(0)) {
      factor = curSlot
        .sub(poolAccount.lastAccSec)
        .mul(poolAccount.rewardPerSec)
        .mul(multiple)
        .div(poolAccount.totalStakingAmount)
    }

    factor = factor.add(poolAccount.lastAccRewardFactor as BN).sub(passbook.account.lastAccRewardFactor as BN)

    const IncRewardAmount = factor.mul(passbook.account.stakingAmount).div(multiple)

    const decimals = await this.getRewardTokenDecimals()

    return new BigNumber(passbook.account.rewardAmount.add(IncRewardAmount).toString()).shiftedBy(-decimals)
  }

  async getClaimedRewards(): Promise<BigNumber | undefined> {
    if (!this.user) return undefined

    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    })

    if (!passbook.account) {
      return new BigNumber(0)
    }

    const decimals = await this.getRewardTokenDecimals()

    return new BigNumber(passbook.account.claimedAmount.toString()).shiftedBy(-decimals)
  }

  async getAvailableRewards(): Promise<BigNumber | undefined> {
    if (!this.user) return

    const historyTotalReward = (await this.getHistoryTotalRewards())!

    const claimedReward = (await this.getClaimedRewards())!

    return new BigNumber(historyTotalReward.minus(claimedReward).toString())
  }

  async getRewardTokenDecimals(): Promise<number> {
    if (this._rewardTokenDecimals === undefined) {
      this._rewardTokenDecimals = await this.getPoolAccount()
        .then(poolAccount => poolAccount.rewardMint)
        .then(rewardMint => this.program.provider.connection.getParsedAccountInfo(rewardMint))
        .then(account => (account.value?.data as ParsedAccountData).parsed.info.decimals as number)
    }

    return this._rewardTokenDecimals
  }

  async getPassbook(): Promise<Passbook | undefined> {
    if (!this.user) return undefined

    const { pool, user, program } = this

    return getPassbook({ pool, user, program })
  }

  async getTokenAccount(
    tokenMint: PublicKey
  ): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> } | undefined> {
    if (!this.user) return undefined

    return (await this.program.provider.connection.getParsedTokenAccountsByOwner(this.user, { mint: tokenMint }))
      .value[0]
  }

  async getPoolAccount(refresh?: boolean): Promise<AccountFromIDL<StakingProgramIdlType, 'pool'>> {
    if (!this._poolAccount || refresh) {
      this._poolAccount = await this.program.account.pool.fetch(this.pool)
    }

    return this._poolAccount
  }

  async getDepositedNFTs(): Promise<Array<ProgramAccount<AccountFromIDL<StakingProgramIdlType, 'asset'>>> | undefined> {
    if (!this.user) return undefined

    const passbook = (await this.getPassbook())!

    const filter = [
      {
        memcmp: {
          offset: 8, // need to prepend 8 bytes for anchor's disc
          bytes: passbook.address.toBase58()
        }
      }
    ]

    return this.program.account.asset.all(filter)
  }

  async _buildWithdrawInstruction(tokenMint: PublicKey) {
    if (!this.user) return undefined

    const { address: passbook } = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    })

    const { pubkey: withdrawAccount } = (await this.getTokenAccount(tokenMint))!

    const [asset] = await PublicKey.findProgramAddress(
      [Buffer.from('asset'), passbook.toBuffer(), tokenMint.toBuffer()],
      this.program.programId
    )

    const { stakingAccount, stakingSigner } = await this.program.account.asset.fetch(asset)

    return this.program.instruction.withdraw(new BN(1), {
      accounts: {
        pool: this.pool,
        passbook,
        asset,
        withdrawAccount,
        stakingSigner,
        stakingAccount,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })
  }

  async _buildClaimInstruction() {
    if (!this.user) return undefined

    const decimals = await this.getRewardTokenDecimals()
    const availableRewards = (await this.getAvailableRewards())!

    const poolAccount = await this.getPoolAccount(true)

    const [rewardSigner] = await PublicKey.findProgramAddress(
      [Buffer.from('reward_signer'), this.pool.toBuffer()],
      this.program.programId
    )

    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    const claimAccount = (
      await this.program.provider.connection.getTokenAccountsByOwner(this.user, { mint: poolAccount.rewardMint })
    ).value[0].pubkey

    return this.program.instruction.claim(new BN(availableRewards.shiftedBy(decimals).toFixed(0)), {
      accounts: {
        passbook: passbook.address,
        pool: this.pool,
        claimAccount,
        rewardSigner,
        rewardAccount: poolAccount.rewardAccount,
        user: this.user,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })
  }
}
