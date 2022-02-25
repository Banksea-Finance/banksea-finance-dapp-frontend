import { useSolanaConnectionConfig } from '@/contexts'
import { useCallback } from 'react'

const useWaitTransaction = () => {
  const { connection } = useSolanaConnectionConfig()

  return useCallback((signature?: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!connection) {
        return reject('No Solana connection found')
      }

      if (!signature) {
        return reject('signature must not be null')
      }

      connection.onSignature(signature, ({ err }) => {
        if (err) {
          return reject(err)
        }

        return resolve()
      })
    })
  }, [connection])
}

export default useWaitTransaction
