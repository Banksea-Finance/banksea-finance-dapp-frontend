import React, { useEffect, useState } from 'react'
import { NavbarContainer, NavbarWrapper, NavItemsContainer, NavLink, NavLinkText } from './index.style'
import Logo from '../BankseaLogo'
import { Link, useLocation } from 'react-router-dom'
import { Wallet } from '@/contexts/theme/components'

import throttle from 'lodash/throttle'

const NavItems = [
  { name: 'Staking', path: '/staking' },
  { name: 'Airdrop', path: '/airdrop' },
  { name: 'IDO', path: '/ido' }
]

const Navbar: React.FC = () => {
  const { pathname } = useLocation()
  const [show, setShow] = useState(true)
  const [, setScrollY] = useState<number>(0)

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
          <Logo />
        </Link>
        <NavItemsContainer itemCount={NavItems.length}>
          {
            NavItems.map(({ name, path }, index) => (
              <NavLink key={`nav-link-${index}`} to={path}>
                <NavLinkText
                  color={pathname === path ? 'primary' : 'text'}
                  className={pathname === path ? 'active' : ''}
                  fontSize={'22px'}
                  important
                  bold
                >
                  {name}
                </NavLinkText>
              </NavLink>
            ))
          }
        </NavItemsContainer>
        <Wallet />
      </NavbarContainer>
    </NavbarWrapper>
  )
}

export default Navbar
