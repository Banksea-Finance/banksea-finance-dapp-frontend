import React from 'react'
import ReactDOM from 'react-dom'
import { default as App } from './App'
import { RefreshControllerProvider, SolanaConnectionConfigProvider, SolanaWeb3Provider } from './contexts'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { GlobalStyles, ModalProvider, NotifyProvider, ThemeWrapperProvider } from '@banksea-finance/ui-kit'
import './index.css'

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
/*
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <SolanaConnectionConfigProvider>
      <SolanaWeb3Provider>
        <ThemeWrapperProvider
          configOverride={{
            siteWidth: '1440px',
            shadows: {
              active: '0px 0px 4px 4px #7864e642'
            },
            colors: {
              primary: '#7864e6',
              primaryContrary: '#D25AE6',
              secondary: '#5A82D2',
              background: '#050F1E',
              backgroundSecondary: '#0A143C',
              text: '#fff',
              disabled: '#999999',
              gradient: 'linear-gradient(90deg, #7864E6 0%, #D25AE6 55%)'
            },
            fontFamilies: {
              common: 'Rajdhani',
              important: 'G8321'
            }
          }}
        >
          <RefreshControllerProvider>
            <BrowserRouter>
              <GlobalStyles />
              <App />
            </BrowserRouter>
          </RefreshControllerProvider>
        </ThemeWrapperProvider>
      </SolanaWeb3Provider>
    </SolanaConnectionConfigProvider>
  </QueryClientProvider>
  , document.getElementById('root')
)*/

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ThemeWrapperProvider
      configOverride={{
        siteWidth: '1200px',
        shadows: {
          active: '0px 0px 4px 4px #7864e642'
        },
        colors: {
          primary: '#7864e6',
          secondary: '#5A82D2',
          primaryContrary: '#A05AE6',
          background: '#050F1E',
          backgroundDisabled: '#1e1e32',
          backgroundSecondary: '#0A143C',
          success: '#329664',
          danger: '#DC6E78',
          text: '#fff',
          disabled: '#999999',
          gradient: 'linear-gradient(90deg, #7864E6 0%, #D25AE6 55%)'
        },
        fontFamilies: {
          common: 'Rajdhani',
          important: 'G8321'
        }
      }}
    >
      <NotifyProvider>
        <SolanaConnectionConfigProvider>
          <SolanaWeb3Provider>
            <RefreshControllerProvider>
              <BrowserRouter>
                <ModalProvider>
                  <GlobalStyles />
                  <App />
                </ModalProvider>
              </BrowserRouter>
            </RefreshControllerProvider>
          </SolanaWeb3Provider>
        </SolanaConnectionConfigProvider>
      </NotifyProvider>
    </ThemeWrapperProvider>
  </QueryClientProvider>
  , document.getElementById('root')
)
