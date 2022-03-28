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
import { BN, Program } from '@project-serum/anchor'
import { getAsset, getPassbook, Passbook } from '@/hooks/programs/useStaking/helpers/accounts'
import { createTokenAccountInstrs } from '@project-serum/common'
import BigNumber from 'bignumber.js'
import { AccountFromIDL } from '@/utils/types'
import { waitTransactionConfirm } from '@/utils'
import { TransactionEventCallback } from '@/components/transactional-dialog'

export class TokenStaker {
  poolName: string
  user?: PublicKey
  program: Program<StakingProgramIdlType>
  pool: PublicKey
  whitelist: PublicKey

  _depositTokenMint?: PublicKey
  _tokenAccounts?: Array<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }>
  _poolAccount?: AccountFromIDL<StakingProgramIdlType, 'pool'>

  constructor(props: {
    program: Program<StakingProgramIdlType>
    poolName: string
    poolAddress: PublicKey
    user?: PublicKey
    whitelist: PublicKey
  }) {
    const { poolAddress, program, whitelist, user, poolName } = props

    this.poolName = poolName
    this.user = user
    this.program = program
    this.pool = poolAddress
    this.whitelist = whitelist
  }

  /**
   * @param amount original number, not lamport
   * @param callback
   */
  async deposit(amount: BigNumber, callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const decimals = await this.depositTokenDecimals()
    const depositAmount: BN = new BN(amount.shiftedBy(decimals).toString())

    const tokenMint = await this.getDepositTokenMint()
    const depositAccount = (await this.findBalanceEnoughDepositAccount(depositAmount))!

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
        }
      })

      tx.add(...createTokenAccountInstructions).add(addAssetInstruction)
    }

    const depositInstruction = await this.program.instruction.deposit(depositAmount, {
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
   * @param amount original number, not lamport
   * @param claim if claim the rewards at the same time or not
   * @param callback
   */
  async withdraw(amount: BigNumber, claim?: boolean, callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const tx = new Transaction()

    if (claim) {
      tx.add((await this._buildClaimInstruction())!)
    }
    tx.add((await this._buildWithdrawInstruction(amount))!)
    callback?.onTransactionBuilt?.()

    const signature = await this.program.provider.send(tx)
    callback?.onSent?.()

    await waitTransactionConfirm(this.program.provider.connection, signature)
    callback?.onConfirm?.(signature)
  }

  async claim(callback?: TransactionEventCallback): Promise<void> {
    if (!this.user) return

    const instruction = (await this._buildClaimInstruction())!
    const tx = new Transaction().add(instruction)
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

    let rewardSeconds = currentSeconds

    // check it is ending
    if (!poolAccount.endSec.eqn(0)) {
      rewardSeconds = currentSeconds < poolAccount.endSec.toNumber() ? currentSeconds : poolAccount.endSec.toNumber()
    }

    const curSlot = new BN(rewardSeconds)
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
    }).catch(e => {
      throw e
    })

    if (!passbook.account) {
      return new BigNumber(0)
    }

    const decimals = await this.getRewardTokenDecimals()

    return new BigNumber(passbook.account.claimedAmount.toString()).shiftedBy(-decimals)
  }

  async getAvailableRewards(): Promise<BigNumber | undefined> {
    if (!this.user) return undefined

    const historyTotalReward = (await this.getHistoryTotalRewards())!

    const claimedReward = (await this.getClaimedRewards())!

    return new BigNumber(historyTotalReward.minus(claimedReward).toString())
  }

  depositTokenDecimals(): Promise<number> {
    return this.getDepositTokenMint()
      .then(tokenMint => this.program.provider.connection.getParsedAccountInfo(tokenMint))
      .then(account => (account.value?.data as ParsedAccountData).parsed.info.decimals)
  }

  getRewardTokenDecimals(): Promise<number> {
    return this.getPoolAccount()
      .then(poolAccount => poolAccount.rewardMint)
      .then(rewardMint => this.program.provider.connection.getParsedAccountInfo(rewardMint))
      .then(account => (account.value?.data as ParsedAccountData).parsed.info.decimals)
  }

  async findBalanceEnoughDepositAccount(
    amount: BN
  ): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> } | undefined> {
    if (!this.user) return undefined

    const accounts = (await this.getTokenAccounts())!

    if (!accounts.length) {
      throw new Error('insufficient balance')
    }

    for (const element of accounts) {
      if (new BN(element.account.data.parsed.info.tokenAmount.amount).gte(amount)) {
        return element
      }
    }

    throw new Error(
      `${accounts.length} available token account(s) was found, but no one of them has sufficient balance`
    )
  }

  async getPassbook(): Promise<Passbook | undefined> {
    if (!this.user) return undefined

    const { pool, user, program } = this

    return getPassbook({ pool, user, program })
  }

  async getUserDeposited(): Promise<BigNumber | undefined> {
    if (!this.user) return undefined

    const passbook = (await this.getPassbook())!

    const amount = passbook.account?.stakingAmount

    if (!amount) {
      return new BigNumber(0)
    }

    const decimals = await this.depositTokenDecimals()

    return new BigNumber(amount.toString()).shiftedBy(-decimals)
  }

  async getTokenAccounts(): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }> | undefined> {
    if (!this.user) return undefined

    if (!this._tokenAccounts) {
      const tokenMint = await this.getDepositTokenMint()

      this._tokenAccounts = (
        await this.program.provider.connection.getParsedTokenAccountsByOwner(this.user, { mint: tokenMint })
      ).value
    }

    return this._tokenAccounts
  }

  async getDepositTokenMint(): Promise<PublicKey> {
    if (!this._depositTokenMint) {
      const account = await this.program.account.whitelist.fetchNullable(this.whitelist).catch(e => {
        throw new Error(`Failed to fetch whitelist account of public key: ${this.whitelist}. (${e.toString()})`)
      })

      if (!account) {
        throw new Error(`Whitelist account not found by public key: ${this.whitelist}`)
      }

      this._depositTokenMint = account.addr
    }

    return this._depositTokenMint
  }

  async getWithdrawTokenAccount(): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> } | undefined> {
    if (!this.user) return undefined

    return (await this.getTokenAccounts())![0]
  }

  async getPoolBalance(): Promise<BigNumber | undefined> {
    if (!this.user) return undefined

    const account = await this.program.account.whitelist.fetchNullable(this.whitelist).catch(e => {
      throw new Error(`Failed to fetch whitelist account of public key: ${this.whitelist}. (${e.toString()})`)
    })

    if (!account) {
      throw new Error(`Whitelist account not found by public key: ${this.whitelist}`)
    }

    const tokenMint = account.addr

    const tokenAccount = await this.program.provider.connection.getParsedTokenAccountsByOwner(this.user, {
      mint: tokenMint
    })

    return new BigNumber(tokenAccount.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || '0')
  }

  async getPoolAccount(refresh?: boolean): Promise<AccountFromIDL<StakingProgramIdlType, 'pool'>> {
    if (!this._poolAccount || refresh) {
      this._poolAccount = await this.program.account.pool.fetch(this.pool)
    }

    return this._poolAccount
  }

  async getTotalDeposited(): Promise<BigNumber> {
    const poolAccount = await this.getPoolAccount(true)

    const decimals = await this.depositTokenDecimals()

    return new BigNumber(poolAccount.totalStakingAmount.toString()).shiftedBy(-decimals)
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
    })

    const claimAccount = (
      await this.program.provider.connection.getTokenAccountsByOwner(this.user, { mint: poolAccount.rewardMint })
    ).value[0].pubkey

    return this.program.instruction.claim(new BN(availableRewards.shiftedBy(decimals).toString()), {
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

  async _buildWithdrawInstruction(amount: BigNumber) {
    if (!this.user) return undefined

    const decimals = await this.depositTokenDecimals()
    const withdrawAmount: BN = new BN(amount.shiftedBy(decimals).toString())

    const { address: passbook } = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    const depositTokenMint = await this.getDepositTokenMint()
    const { pubkey: withdrawAccount } = (await this.getWithdrawTokenAccount())!

    const [asset] = await PublicKey.findProgramAddress(
      [Buffer.from('asset'), passbook.toBuffer(), depositTokenMint.toBuffer()],
      this.program.programId
    )

    const { stakingAccount, stakingSigner } = await this.program.account.asset.fetch(asset)

    return this.program.instruction.withdraw(withdrawAmount, {
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
}
