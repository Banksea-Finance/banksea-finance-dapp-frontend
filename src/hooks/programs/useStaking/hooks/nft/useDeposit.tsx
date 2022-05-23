import React, { useCallback } from 'react'
import { useModal, useSolanaWeb3 } from '@/contexts'
import { Text } from '@/contexts/theme/components'
import { MetadataResult } from '@/utils/metaplex/metadata'
import TransactionalDialog from '@/components/TransactionalDialog'
import { buildRegisterInstruction } from '../../helpers/instructions'
import { Transaction } from '@solana/web3.js'
import { useStakingProgram } from '../common'
import { NFTStakingPoolConfig } from '../../constants/nft'
import { buildDepositNFTsTransactions } from '../../helpers/transactions'
import { WalletNotConnectedError } from '@/utils/errors'

const NFTDepositDialog: React.FC<{ config: NFTStakingPoolConfig; metadataList: MetadataResult[] }> = ({
  config,
  metadataList
}) => {
  const { pool: pool, name, whitelist } = config
  const { account: user } = useSolanaWeb3()
  const program = useStakingProgram()

  const handleDeposit = useCallback(async () => {
    if (!user) throw WalletNotConnectedError

    const registerInstruction = await buildRegisterInstruction({
      user,
      program,
      pool: config.pool
    })

    const transactions = registerInstruction
      ? [
        new Transaction({
          recentBlockhash: (await program.provider.connection.getLatestBlockhash()).blockhash,
          feePayer: user
        }).add(registerInstruction)
      ]
      : []

    const depositTransactions = await buildDepositNFTsTransactions({
      tokens: metadataList.map(meta => ({ tokenMint: meta.mint, metadata: meta.address })),
      user,
      pool,
      whitelist,
      program
    })

    transactions.push(...depositTransactions)

    return transactions
  }, [config, user, program])

  return (
    <TransactionalDialog
      maxWidth={'600px'}
      transactionName={`Deposit ${name}`}
      title={`Deposit ${name}`}
      transactionsBuilder={handleDeposit}
    >
      <Text fontSize={'18px'} bold>
        Are you sure to deposit {metadataList.map(metadata => metadata.account?.data.data.name).join(', ')}?
      </Text>
    </TransactionalDialog>
  )
}

const useDeposit = (config: NFTStakingPoolConfig) => {
  const { openModal } = useModal()

  return useCallback(async (metadataList: MetadataResult[]) => {
    openModal(<NFTDepositDialog config={config} metadataList={metadataList} />, false)
  }, [config])
}

export default useDeposit