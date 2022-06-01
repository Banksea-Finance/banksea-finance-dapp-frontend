import React, { useCallback } from 'react'
import { MetadataResult } from '@/utils/metaplex/metadata'
import { Text, useModal } from '@banksea-finance/ui-kit'
import TransactionalDialog from '@/components/TransactionalDialog'
import { SYSVAR_CLOCK_PUBKEY, Transaction } from '@solana/web3.js'
import { CollectionStoragePoolAddress } from '@/hooks/programs/useCollectionStorage/constants'
import { getAssetSigner, getPassbookSigner, getStakingSigner } from '@/hooks/programs/useCollectionStorage/utils'
// @ts-ignore
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useCollectionStorageProgram } from '@/hooks/programs/useCollectionStorage/hooks/useCollectionStorageProgram'
import { WalletNotConnectedError } from '@/utils/errors'
import { useSolanaWeb3 } from '@/contexts'

const WithdrawDialog: React.FC<{ metadataResult: MetadataResult }> = ({ metadataResult }) => {
  const { closeModal } = useModal()
  const program = useCollectionStorageProgram()
  const { account } = useSolanaWeb3()

  const withdraw = useCallback(async () => {
    if (!account) throw WalletNotConnectedError

    const tx = new Transaction()
    const user = account
    const token = metadataResult.mint
    const pool = CollectionStoragePoolAddress

    const [passbook] = await getPassbookSigner(pool, user)
    const [asset] = await getAssetSigner(passbook, token)
    const [stakingSigner] = await getStakingSigner(passbook, token)

    const assetAccount = await program.account.asset.fetch(asset)
    const withdrawAccount = await getAssociatedTokenAddress(token, user)

    const instruction = program.instruction.withdraw({
      accounts: {
        pool,
        passbook,
        asset,
        withdrawAccount,
        stakingAccount: assetAccount.stakingAccount,
        stakingSigner,
        user,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY
      }
    })

    tx.add(instruction)

    return tx
  }, [program, account])

  const name = metadataResult.account?.data.data.name

  return (
    <TransactionalDialog
      transactionName={`Withdraw ${name}`}
      title={`Withdraw ${name}`}
      onCancel={closeModal}
      transactionsBuilder={withdraw}
    >
      <Text fontSize={'18px'} mb={'8px'} bold>
        Are you sure to withdraw {metadataResult.account?.data.data.name}?
      </Text>
    </TransactionalDialog>
  )
}

const useWithdraw = () => {
  const { openModal } = useModal()

  return useCallback((metadataResult: MetadataResult) => {
    openModal(<WithdrawDialog metadataResult={metadataResult} />, false)
  }, [])
}

export default useWithdraw
