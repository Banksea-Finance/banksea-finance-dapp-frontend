import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppContainer } from '@/App.style'
import Navbar from '@/components/navbar'
import StakingPage from '@/pages/staking'
import Redirect from '@/pages/redirect'
import BigNumber from 'bignumber.js'
import AirdropPage from '@/pages/airdrop'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

BigNumber.config({
  EXPONENTIAL_AT: 64
})

const App: React.FC = () => {
  const location = useLocation()

  return (
    <AppContainer id={'app'}>
      <Navbar />
      <div style={{ height: '100px', width: '100%' }} />
      <TransitionGroup component={null}>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path={'/'} element={<Redirect to={'/staking'} />} />
            <Route path={'staking'} element={<StakingPage />} />
            <Route path={'airdrop'} element={<AirdropPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </AppContainer>
  )
}

export default App
