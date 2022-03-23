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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ThemeWrapperProvider>
      <GlobalStyles />
      <SolanaConnectionConfigProvider>
        <SolanaWeb3Provider>
          <ModalProvider>
            <RefreshControllerProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </RefreshControllerProvider>
          </ModalProvider>
        </SolanaWeb3Provider>
      </SolanaConnectionConfigProvider>
    </ThemeWrapperProvider>
  </QueryClientProvider>,
  document.getElementById('root')
)
reportWebVitals()
