import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppContainer } from '@/App.style'
import Navbar from '@/components/navbar'
import StakingPage from '@/pages/staking'
import Redirect from '@/pages/redirect'
import BigNumber from 'bignumber.js'
import AirdropPage from '@/pages/airdrop'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'

BigNumber.config({
  EXPONENTIAL_AT: 64
})

const NavbarPlaceHolder = styled.div`
  width: 100%;
  
  height: 100px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    height: 68px;
  }
`

const App: React.FC = () => {
  const location = useLocation()

  return (
    <AppContainer id={'app'}>
      <Navbar />
      <NavbarPlaceHolder />
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
