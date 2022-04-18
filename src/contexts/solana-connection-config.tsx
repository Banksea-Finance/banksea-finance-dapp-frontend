import useLocalStorage from '@/hooks/useLocalStorage'
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import React, { useContext, useEffect, useMemo } from 'react'

interface ConnectionConfig {
  connection: Connection
  endpointUrl: string
  setEndpoint: (val: string) => void
}

export const SOLANA_CLUSTER: Cluster = process.env.REACT_APP_SOLANA_CLUSTER as Cluster || 'devnet'

export const SOLANA_ENDPOINT: string = process.env.REACT_APP_SOLANA_ENDPOINT || clusterApiUrl(SOLANA_CLUSTER)

const SolanaConnectionConfigContext = React.createContext<ConnectionConfig>({
  endpointUrl: SOLANA_ENDPOINT,
  setEndpoint: () => {},
  connection: new Connection(SOLANA_ENDPOINT, 'recent'),
})

export function SolanaConnectionConfigProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useLocalStorage<string>('connectionEndpts', SOLANA_ENDPOINT)

  const connection = useMemo(() => new Connection(endpoint!, 'recent'), [endpoint])

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(PublicKey.default, () => {})

    return () => {
      connection.removeAccountChangeListener(id)
    }
  }, [connection])

  useEffect(() => {
    const id = connection.onSlotChange(() => null)

    return () => {
      connection.removeSlotChangeListener(id)
    }
  }, [connection])

  return (
    <SolanaConnectionConfigContext.Provider
      value={{
        endpointUrl: endpoint!,
        setEndpoint,
        connection,
      }}
    >
      {children}
    </SolanaConnectionConfigContext.Provider>
  )
}

export function useSolanaConnectionConfig() {
  return useContext(SolanaConnectionConfigContext)
}
