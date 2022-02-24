import { AccountInfo, Commitment } from '@solana/web3.js'

export const getUnixTs = () => {
  return new Date().getTime() / 1000
}

const getMultipleAccountsCore = async (connection: any, keys: string[], commitment: string) => {
  const args = connection._buildArgs([keys], commitment as Commitment, 'base64')

  const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)
  if (unsafeRes.error) {
    throw new Error('failed to get info about account ' + unsafeRes.error.message)
  }

  if (unsafeRes.result.value) {
    const array = unsafeRes.result.value as AccountInfo<string[]>[]
    return { keys, array }
  }

  // TODO: fix
  throw new Error()
}

export function chunks(array: Array<any>, size: number) {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size),
  )
}

export const getMultipleAccounts = async (connection: any, keys: string[], commitment: string) => {
  const result = await Promise.all(
    chunks(keys, 99).map(chunk => getMultipleAccountsCore(connection, chunk, commitment)),
  )

  const array = result
    .map(
      a =>
        a.array.map(acc => {
          if (!acc) {
            return undefined
          }

          const { data, ...rest } = acc
          return {
            ...rest,
            data: Buffer.from(data[0], 'base64'),
          } as AccountInfo<Buffer>
        }) as AccountInfo<Buffer>[],
    )
    .flat()
  return { keys, array }
}
