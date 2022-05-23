import React from 'react'
import ReactDOM from 'react-dom'
import { default as App } from './App'
import reportWebVitals from './reportWebVitals'
import {
  ModalProvider,
  RefreshControllerProvider,
  SolanaConnectionConfigProvider,
  SolanaWeb3Provider,
  ThemeWrapperProvider
} from './contexts'
import { QueryClient, QueryClientProvider } from 'react-query'
import { GlobalStyles } from './contexts/theme/styles'
import { BrowserRouter } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { ComponentStylesOverride } from '@/contexts/theme/types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

BigNumber.config({
  EXPONENTIAL_AT: 64,
})

const componentsStylesOverride: ComponentStylesOverride = {
}

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ThemeWrapperProvider componentsOverride={componentsStylesOverride}>
      <GlobalStyles />
      <SolanaConnectionConfigProvider>
        <SolanaWeb3Provider>
          <RefreshControllerProvider>
            <ModalProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ModalProvider>
          </RefreshControllerProvider>
        </SolanaWeb3Provider>
      </SolanaConnectionConfigProvider>
    </ThemeWrapperProvider>
  </QueryClientProvider>,
  document.getElementById('root')
)
reportWebVitals()
