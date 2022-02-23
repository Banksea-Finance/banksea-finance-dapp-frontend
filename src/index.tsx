import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      retry: false
    }
  }
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ThemeWrapperProvider>
      <GlobalStyles />
      <ModalProvider>
        <RefreshControllerProvider>
          <SolanaConnectionConfigProvider>
            <SolanaWeb3Provider>
              <App />
            </SolanaWeb3Provider>
          </SolanaConnectionConfigProvider>
        </RefreshControllerProvider>
      </ModalProvider>
    </ThemeWrapperProvider>
  </QueryClientProvider>,
  document.getElementById('root')
)
reportWebVitals()
