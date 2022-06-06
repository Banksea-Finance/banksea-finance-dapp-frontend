import React, { useEffect, useState } from 'react'
import { NavbarContainer, NavbarWrapper } from './index.style'
import { Link } from 'react-router-dom'

import throttle from 'lodash/throttle'
import { Wallet } from '../Wallet'
import { BankseaImageLogoSvg, BankseaTextLogoSvg } from '@/components/svgs'
import { useResponsive } from '@banksea-finance/ui-kit'

// const NavItems = [
//   { name: 'Staking', path: '/staking' },
//   { name: 'Airdrop', path: '/airdrop' },
//   { name: 'IDO', path: '/ido' }
// ]

export const Navbar: React.FC = () => {
  // const { pathname } = useLocation()
  const [show, setShow] = useState(true)
  const [, setScrollY] = useState<number>(0)

  const { isMobile } = useResponsive()

  useEffect(() => {
    const cb = throttle(event => {
      setScrollY(prev => {
        const v = event.target.scrollingElement.scrollTop

        if (v < prev) {
          setShow(true)
          return v
        }

        if (v >= 100) {
          setShow(false)
        }

        return v
      })
    }, 150)

    window.addEventListener('scroll', cb)

    return () => {
      window.removeEventListener('scroll', cb)
    }
  }, [])

  return (
    <NavbarWrapper className={show ? 'show' : 'hide'}>
      <NavbarContainer>
        <Link to={'/'}>
          {isMobile ? <BankseaImageLogoSvg /> : <BankseaTextLogoSvg />}
        </Link>
        {/*<NavItemsContainer itemCount={NavItems.length}>*/}
        {/*  {*/}
        {/*    NavItems.map(({ name, path }, index) => (*/}
        {/*      <NavLink key={`nav-link-${index}`} to={path}>*/}
        {/*        <NavLinkText*/}
        {/*          color={pathname === path ? 'primary' : 'text'}*/}
        {/*          className={pathname === path ? 'active' : ''}*/}
        {/*          fontSize={'22px'}*/}
        {/*          important*/}
        {/*          bold*/}
        {/*        >*/}
        {/*          {name}*/}
        {/*        </NavLinkText>*/}
        {/*      </NavLink>*/}
        {/*    ))*/}
        {/*  }*/}
        {/*</NavItemsContainer>*/}
        <Wallet />
      </NavbarContainer>
    </NavbarWrapper>
  )
}
