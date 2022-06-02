import { Provider } from '@project-serum/anchor'
// @ts-ignore
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  SignatureResult,
  Signer,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'

export const getBalanceLargestTokenAccount = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<
  | {
      pubkey: PublicKey
      account: AccountInfo<ParsedAccountData>
    }
  | undefined
> => {
  const tokenAccounts = (await connection.getParsedTokenAccountsByOwner(owner, { mint })).value

  if (!tokenAccounts.length) return undefined

  const getAmount = (account: AccountInfo<ParsedAccountData>) => account.data.parsed.info.tokenAmount.uiAmount

  tokenAccounts.sort((a, b) => getAmount(b.account) - getAmount(a.account))

  return tokenAccounts[0]
}

export const getOrCreateTokenAccount = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  type: 'associate' | 'largest' = 'associate'
): Promise<{
  pubkey: PublicKey
  instruction?: TransactionInstruction
}> => {
  const associatedTokenAddress: PublicKey = await getAssociatedTokenAddress(mint, owner)
  const largestTokenAccount = await getBalanceLargestTokenAccount(connection, mint, owner)

  if (type === 'associate') {
    const associatedTokenAccount = await connection.getAccountInfo(associatedTokenAddress)

    if (associatedTokenAccount) return { pubkey: associatedTokenAddress }

    return {
      pubkey: associatedTokenAddress,
      instruction: await createAssociatedTokenAccountInstruction(owner, associatedTokenAddress, owner, mint)
    }
  } else {
    if (largestTokenAccount) return { pubkey: largestTokenAccount.pubkey }

    return {
      pubkey: associatedTokenAddress,
      instruction: await createAssociatedTokenAccountInstruction(owner, associatedTokenAddress, owner, mint)
    }
  }
}

export function waitTransactionConfirm(connection: Connection, signature: string) {
  return new Promise<void>((resolve, reject) => {
    connection.onSignature(signature, (signatureResult: SignatureResult) => {
      if (signatureResult.err) {
        return reject(signatureResult.err)
      } else {
        return resolve()
      }
    })
  })
}

export async function buildTransaction(
  provider: Provider,
  instructions: (TransactionInstruction | undefined)[],
  signers?: Signer[],
  feePayer?: PublicKey
): Promise<Transaction> {
  const tx = new Transaction({
    recentBlockhash: (await provider.connection.getLatestBlockhash()).blockhash,
    feePayer: feePayer || provider.wallet.publicKey
  })

  const nonNullInstructions = instructions.filter(i => i !== undefined) as TransactionInstruction[]

  if (nonNullInstructions.length) {
    tx.add(...nonNullInstructions)
  }

  if (signers?.length) {
    tx.sign(...signers)
  }

  return tx
}

export const shortenAddress = (address?: string | PublicKey, length = 6) => {
  const str = address?.toString()

  return str ? `${str.slice(0, length)}...${str.slice(-length)}` : '-'
}
