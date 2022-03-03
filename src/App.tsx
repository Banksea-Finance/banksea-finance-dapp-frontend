import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContainer } from '@/App.style'
import Navbar from '@/components/navbar'
import StakingPage from '@/pages/staking'
import Redirect from '@/pages/redirect'
import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 64
})

const App: React.FC = () => {
  return (
    <AppContainer id={'app'}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={'/'} element={<Redirect to={'/staking'} />} />
          <Route path={'staking'} element={<StakingPage />} />
          <Route path={'airdrop'} element={<div>????</div>} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  )
}

export default App
