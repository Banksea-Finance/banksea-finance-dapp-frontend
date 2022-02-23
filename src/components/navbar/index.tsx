import React, { useMemo } from 'react'
import { NavbarContainer, NavItem, NavItemsContainer } from './index.style'
import Logo from '../logo'
import { Link, useLocation } from 'react-router-dom'
import { Wallet } from '@/contexts/theme/components'
import { useResponsive } from '@/contexts/theme/hooks'

const NAV_ITEMS = [
  { name: 'Airdrop', href: 'about-us' },
  { name: 'Staking', href: 'utility' },
]

const Navbar: React.FC = () => {
  const { pathname } = useLocation()

  const atHomePage = useMemo(() => pathname === '/', [pathname])

  const { isDesktop } = useResponsive()

  return (
    <NavbarContainer>
      <Link to={'/'}>
        <Logo width={isDesktop ? '144px' : '35vw'} />
      </Link>
      {atHomePage && (
        <NavItemsContainer>
          {NAV_ITEMS.map(({ name, href }, index) => (
            <NavItem smooth key={index} to={href}>
              {name}
            </NavItem>
          ))}
        </NavItemsContainer>
      )}
      <Wallet />
    </NavbarContainer>
  )
}

export default Navbar
