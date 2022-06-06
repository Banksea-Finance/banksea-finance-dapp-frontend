import React, { useCallback } from 'react'
import { useSolanaWeb3 } from '@/contexts'
import { Text, useModal } from '@banksea-finance/ui-kit'
import { MetadataResult } from '@/utils/metaplex/metadata'
import TransactionalDialog from '@/components/TransactionalDialog'
import { Keypair, SystemProgram, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from '@solana/web3.js'
// @ts-ignore
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createTokenAccountInstrs } from '@project-serum/common'
import { buildTransaction } from '@/utils'
import { useCollectionStorageProgram } from './useCollectionStorageProgram'
import { CollectionStoragePoolAddress } from '../constants'
import { getAssetSigner, getPassbookSigner, getStakingSigner, getWhitelistSigner } from '../utils'
import { WalletNotConnectedError } from '@/utils/errors'

const DepositDialog: React.FC<{ metadataResult: MetadataResult }> = ({ metadataResult }) => {
  const program = useCollectionStorageProgram()
  const { account } = useSolanaWeb3()

  const transactionsBuilder = useCallback(async () => {
    if (!account) throw WalletNotConnectedError

    const instructions: TransactionInstruction[] = []
    const signers: Keypair[] = []

    const user = account
    const token = metadataResult.mint
    const metadata = metadataResult.address
    const pool = CollectionStoragePoolAddress

    const newStakingAccount = Keypair.generate()
    const [passbook, passbookBump] = getPassbookSigner(pool, user)
    const [asset, assetBump] = getAssetSigner(passbook, token)
    const [stakingSigner, stakingSignerBump] = getStakingSigner(passbook, token)
    const [whitelist] = getWhitelistSigner(pool, token)

    const passbookAccount = await program.provider.connection.getAccountInfo(passbook)
    const assetAccount = await program.account.asset.fetchNullable(asset)
    const depositAccount = await getAssociatedTokenAddress(token, user)

    if (!passbookAccount) {
      instructions.push(
        program.instruction.register(passbookBump, {
          accounts: {
            pool,
            passbook,
            user,
            payer: user,
            systemProgram: SystemProgram.programId
          }
        })
      )
    }

    if (!assetAccount) {
      const createTokenAccountInstructions = await createTokenAccountInstrs(
        program.provider,
        newStakingAccount.publicKey,
        token,
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
          payer: program.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        remainingAccounts: [
          {
            pubkey: metadata,
            isWritable: false,
            isSigner: false
          }
        ]
      })

      instructions.push(...createTokenAccountInstructions)
      instructions.push(addAssetInstruction)
      signers.push(newStakingAccount)
    }

    instructions.push(
      program.instruction.deposit({
        accounts: {
          pool,
          passbook,
          asset,
          depositAccount,
          stakingAccount: assetAccount?.stakingAccount || newStakingAccount.publicKey,
          user: account,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY
        }
      })
    )

    return buildTransaction(program.provider, instructions, signers)
  }, [program, account])

  const name = metadataResult.account?.data.data.name

  return (
    <TransactionalDialog
      transactionName={`Deposit ${name}`}
      title={`Deposit ${name}`}
      transactionsBuilder={transactionsBuilder}
    >
      <Text fontSize={'18px'} bold>
        Are you sure to deposit {name}?
      </Text>
    </TransactionalDialog>
  )
}

export const useDeposit = () => {
  const { openModal } = useModal()

  return useCallback(async (metadataResult: MetadataResult) => {
    openModal(<DepositDialog metadataResult={metadataResult} />, false)
  }, [])
}
