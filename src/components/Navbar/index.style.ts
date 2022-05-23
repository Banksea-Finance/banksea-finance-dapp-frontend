import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Text } from '@/contexts/theme/components'

export const NavbarWrapper = styled.div`
  width: 100%;
  position: fixed;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  transform: translateY(0);
  transition: transform 0.38s;
  z-index: 5;
  box-shadow: ${({ theme }) => theme.shadows.level1};

  &.hide {
    transform: translateY(-100px);
  }
`

export const NavbarContainer = styled.div`
  margin: 0 auto;
  padding: 16px 32px;
  max-width: ${({ theme }) => theme.siteWidth};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 10px;
    width: 100vw;
  }
`

export const NavItemsContainer = styled.div<{ itemCount: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.itemCount}, 1fr);
  width: fit-content;
  gap: 0 32px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

export const NavLink = styled(Link)`
  position: relative;
  cursor: pointer;

  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 12px;
  }
`

export const NavLinkText = styled(Text)`
  transition: color 0.38s;
  
  :hover:not(.active) {
    color: ${({ theme }) => theme.colors.subtle};
  }
`