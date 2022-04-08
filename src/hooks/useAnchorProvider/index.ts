import { useSolanaConnectionConfig } from '@/contexts/solana-connection-config'
import { useSolanaWeb3 } from '@/contexts/solana-web3'
import { Provider } from '@project-serum/anchor'
import { useMemo } from 'react'
import { MockWallet } from '@/hooks/useAnchorProvider/MockWallet'

const useAnchorProvider = () => {
  const { connection } = useSolanaConnectionConfig()
  const { adapter } = useSolanaWeb3()

  return useMemo<{ provider: Provider; readOnly: boolean }>(() => {
    if (!adapter) {
      const mockWallet = new MockWallet()

      return {
        provider: new Provider(connection, mockWallet, {}),
        readOnly: true
      }
    }

    return {
      provider: new Provider(connection, adapter, {}),
      readOnly: false
    }
  }, [connection, adapter])
}

export default useAnchorProvider
