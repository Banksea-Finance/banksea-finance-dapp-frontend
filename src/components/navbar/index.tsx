import React from 'react'
import { NavbarContainer, NavLink, NavItemsContainer } from './index.style'
import Logo from '../logo'
import { Link, useLocation } from 'react-router-dom'
import { Wallet } from '@/contexts/theme/components'
import { useResponsive } from '@/contexts/theme/hooks'

const NAV_ITEMS = [
  { name: 'Staking', path: '/staking' },
  { name: 'Airdrop', path: '/airdrop' }
]

const Navbar: React.FC = () => {
  const { pathname } = useLocation()

  const { isDesktop } = useResponsive()

  return (
    <NavbarContainer>
      <Link to={'/'}>
        <Logo width={isDesktop ? '144px' : '35vw'} />
      </Link>
      <NavItemsContainer>
        {NAV_ITEMS.map(({ name, path }, index) => (
          <NavLink key={index} to={path} $active={pathname === path}>
            {name}
          </NavLink>
        ))}
      </NavItemsContainer>
      <Wallet />
    </NavbarContainer>
  )
}

export default Navbar
