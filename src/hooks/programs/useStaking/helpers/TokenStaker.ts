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

export class TokenStaker {
  poolName: string
  user: PublicKey
  program: Program<StakingProgramIdlType>
  pool: PublicKey
  whitelist: PublicKey
  rewardWallet: PublicKey

  _depositTokenMint?: PublicKey
  _tokenAccounts?: Array<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }>
  _poolAccount?: AccountFromIDL<StakingProgramIdlType, 'pool'>

  constructor(props: {
    program: Program<StakingProgramIdlType>
    poolName: string
    poolAddress: PublicKey
    user: PublicKey
    rewardWallet: PublicKey
    whitelist: PublicKey
  }) {
    const { poolAddress, rewardWallet, program, whitelist, user, poolName } = props

    this.poolName = poolName
    this.user = user
    this.program = program
    this.pool = poolAddress
    this.whitelist = whitelist
    this.rewardWallet = rewardWallet
  }

  async deposit(depositAmount: BN): Promise<void> {
    const tokenMint = await this.getDepositTokenMint()
    const depositAccount = await this.findBalanceEnoughDepositAccount(depositAmount)

    const newStakingAccount = Keypair.generate()
    const tx = new Transaction()

    // check passbook or register
    const passbook = await this.getPassbook()

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

    await this.program.provider.send(tx, assetAccount ? [] : [newStakingAccount])
  }

  async withdraw(withdrawAmount: BN): Promise<void> {
    const { address: passbook } = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    const depositTokenMint = await this.getDepositTokenMint()
    const { pubkey: withdrawAccount } = await this.getWithdrawTokenAccount()

    const [asset] = await PublicKey.findProgramAddress(
      [Buffer.from('asset'), passbook.toBuffer(), depositTokenMint.toBuffer()],
      this.program.programId
    )

    const { stakingAccount, stakingSigner } = await this.program.account.asset.fetch(asset)

    await this.program.rpc.withdraw(withdrawAmount, {
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

  async harvest(): Promise<void> {
    const availableRewards = await this.getAvailableRewards()

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

    await this.program.rpc.claim(new BN(availableRewards.toString()), {
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

  async getHistoryTotalRewards(): Promise<BigNumber> {
    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    if (!passbook.account) {
      throw new Error('Passbook account not found, maybe you have not deposit yet?')
    }

    const poolAccount = await this.getPoolAccount(true)

    const slot = await this.program.provider.connection.getSlot()

    let rewardSlot = slot

    // check it is ending
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

    factor = factor.add(poolAccount.lastAccRewardFactor as BN).sub(passbook.account.lastAccRewardFactor as BN)

    const IncRewardAmount = factor.mul(passbook.account.stakingAmount).div(multiple)

    return new BigNumber(passbook.account.rewardAmount.add(IncRewardAmount).toString())
  }

  async getClaimedRewards(): Promise<BigNumber> {
    const passbook = await getPassbook({
      pool: this.pool,
      user: this.user,
      program: this.program
    }).catch(e => {
      throw e
    })

    if (!passbook.account) {
      throw new Error('Passbook account not found, maybe you have not deposit yet?')
    }

    return new BigNumber(passbook.account.claimedAmount.toString())
  }

  async getAvailableRewards(): Promise<BigNumber> {
    const historyTotalReward = await this.getHistoryTotalRewards()

    const claimedReward = await this.getClaimedRewards()

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
  ): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }> {
    const accounts = await this.getTokenAccounts()

    if (!accounts.length) {
      throw new Error('')
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

  async getPassbook(): Promise<Passbook> {
    const { pool, user, program } = this

    return getPassbook({ pool, user, program })
  }

  async getUserDeposited(): Promise<BigNumber> {
    const passbook = await this.getPassbook()

    const amount = passbook.account?.stakingAmount

    if (!amount) {
      return new BigNumber(0)
    }

    const decimals = await this.depositTokenDecimals()

    return new BigNumber(amount.toString()).shiftedBy(-decimals)
  }

  async getTokenAccounts(): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }>> {
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

  async getWithdrawTokenAccount(): Promise<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }> {
    return (await this.getTokenAccounts())[0]
  }

  async getPoolBalance(): Promise<BigNumber> {
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
}
