import React, { useCallback } from 'react'
import { useModal, useRefreshController, useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import TransactionalDialog, { TransactionEventCallback } from '@/components/TransactionalDialog'
import { Keypair, SystemProgram, SYSVAR_CLOCK_PUBKEY, Transaction } from '@solana/web3.js'
// @ts-ignore
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createTokenAccountInstrs } from '@project-serum/common'
import { waitTransactionConfirm } from '@/utils'
import { useCollectionStorageProgram } from './useCollectionStorageProgram'
import { CollectionStoragePoolAddress } from '../constants'
import { getPassbookSigner, getStakingSigner, getWhitelistSigner, getAssetSigner } from '../utils'

const DepositDialog: React.FC<{ metadataResult: MetadataResult }> = ({ metadataResult }) => {
  const { forceRefresh } = useRefreshController()
  const program = useCollectionStorageProgram()
  const { account } = useSolanaWeb3()

  const deposit = useCallback(
    async (callbacks: TransactionEventCallback) => {
      if (!account) return

      const tx = new Transaction()
      const signers: Keypair[] = []

      const user = account
      const token = metadataResult.mint
      const metadata = metadataResult.address
      const pool = CollectionStoragePoolAddress

      const newStakingAccount = Keypair.generate()
      const [passbook, passbookBump] = await getPassbookSigner(pool, user)
      const [asset, assetBump] = await getAssetSigner(passbook, token)
      const [stakingSigner, stakingSignerBump] = await getStakingSigner(passbook, token)
      const [whitelist] = await getWhitelistSigner(pool, token)

      const passbookAccount = await program.provider.connection.getAccountInfo(passbook)
      const assetAccount = await program.account.asset.fetchNullable(asset)
      const depositAccount = await getAssociatedTokenAddress(token, user)

      if (!passbookAccount) {
        tx.add(
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
        console.log('asset account null')

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

        tx.add(...createTokenAccountInstructions).add(addAssetInstruction)
        signers.push(newStakingAccount)
      }

      tx.add(
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

      callbacks?.onTransactionBuilt?.()

      const signature = await program.provider.send(tx, signers)
      callbacks?.onSent?.()
      await waitTransactionConfirm(program.provider.connection, signature)
      callbacks?.onConfirm?.(signature)

      forceRefresh()
    },
    [program, account]
  )

  const name = metadataResult.account?.data.data.name

  return (
    <TransactionalDialog transactionName={`Deposit ${name}`} title={`Deposit ${name}`} onSendTransaction={deposit}>
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
