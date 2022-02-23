import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContainer } from '@/App.style'
import Navbar from '@/components/navbar'
import StakingPage from '@/pages/staking'
import Redirect from '@/pages/redirect'

const App: React.FC = () => {
  return (
    <AppContainer>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={'/'} element={<Redirect to={'/staking'} />} />
          <Route path={'/staking'} element={<StakingPage />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  )
}

export default App
