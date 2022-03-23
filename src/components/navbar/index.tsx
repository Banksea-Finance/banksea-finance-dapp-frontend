import React, { useEffect, useState } from 'react'
import { NavbarContainer, NavbarWrapper, NavItemsContainer, NavLink, NavLinkText } from './index.style'
import Logo from '../logo'
import { Link, useLocation } from 'react-router-dom'
import { Wallet } from '@/contexts/theme/components'
import { useResponsive } from '@/contexts/theme/hooks'

import throttle from 'lodash/throttle'

const NAV_ITEMS = [
  { name: 'Staking', path: '/staking' },
  { name: 'Airdrop', path: '/airdrop' }
]

const Navbar: React.FC = () => {
  const { pathname } = useLocation()
  const { isDesktop } = useResponsive()

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
          <Logo width={isDesktop ? '144px' : '35vw'} />
        </Link>
        <NavItemsContainer>
          {NAV_ITEMS.map(({ name, path }, index) => (
            <NavLink key={index} to={path}>
              <NavLinkText
                color={pathname === path ? 'primaryContrary' : 'text'}
                className={pathname === path ? 'active' : ''}
                fontSize={'22px'}
                important
                bold
              >
                {name}
              </NavLinkText>
            </NavLink>
          ))}
        </NavItemsContainer>
        <Wallet />
      </NavbarContainer>
    </NavbarWrapper>
  )
}

export default Navbar
