import useLocalStorage from '@/hooks/useLocalStorage'
import { Account, Cluster, clusterApiUrl, Connection } from '@solana/web3.js'
import React, { useContext, useEffect, useMemo } from 'react'
import { ENV as ChainID } from '@solana/spl-token-registry'

interface ConnectionConfig {
  connection: Connection
  endpointUrl: string
  network: Cluster
  setEndpoint: (val: string) => void
}

export type Endpoint = {
  name: Cluster
  rpcUrl: string
  chainID: ChainID
}

export const SOLANA_CLUSTER = process.env.REACT_APP_SOLANA_CLUSTER as Cluster

export const SOLANA_END_POINT_URL = process.env.REACT_APP_SOLANA_END_POINT || clusterApiUrl(SOLANA_CLUSTER)

export const ENDPOINTS: Record<Cluster, Endpoint> = {
  'mainnet-beta': {
    name: 'mainnet-beta',
    rpcUrl: 'https://solana-api.projectserum.com/',
    chainID: ChainID.MainnetBeta
  },
  testnet: {
    name: 'testnet',
    rpcUrl: clusterApiUrl('testnet'),
    chainID: ChainID.Testnet
  },
  devnet: {
    name: 'devnet',
    rpcUrl: clusterApiUrl('devnet'),
    chainID: ChainID.Devnet
  }
}

const DEFAULT_ENDPOINT = ENDPOINTS[SOLANA_CLUSTER]

const SolanaConnectionConfigContext = React.createContext<ConnectionConfig>({
  endpointUrl: SOLANA_END_POINT_URL || DEFAULT_ENDPOINT.rpcUrl,
  setEndpoint: () => {},
  connection: new Connection(DEFAULT_ENDPOINT.rpcUrl, 'recent'),
  network: SOLANA_CLUSTER
})

export function SolanaConnectionConfigProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useLocalStorage<string>('connectionEndpts', DEFAULT_ENDPOINT.rpcUrl)

  const connection = useMemo(() => new Connection(endpoint!, 'recent'), [endpoint])

  const chain = ENDPOINTS[endpoint as Cluster] ?? DEFAULT_ENDPOINT
  const env = chain.name

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {})
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
        network: env
      }}
    >
      {children}
    </SolanaConnectionConfigContext.Provider>
  )
}

export function useSolanaConnectionConfig() {
  return useContext(SolanaConnectionConfigContext)
}
