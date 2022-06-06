import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppContainer } from '@/App.style'
import { Navbar } from '@/components/Navbar'
import Redirect from '@/pages/redirect'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { StakingPage } from './pages'

const NavbarPlaceHolder = styled.div`
  width: 100%;

  height: 100px;

  ${({ theme }) => theme.mediaQueries.maxXl} {
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
            {/*<Route path={'airdrop'} element={<AirdropPage />} />
            <Route path={'ido'} element={<IdoPage />} />*/}
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </AppContainer>
  )
}

export default App
