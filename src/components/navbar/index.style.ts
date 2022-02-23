import styled from 'styled-components'
import { Link } from 'react-scroll'
import { Button } from '@/contexts/theme/components'

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
  }
`

export const NavItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: fit-content;
  gap: 0 30px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 10px;
    margin-left: 13vw;
    width: 40vw;
  }
`

export const NavItem = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  position: relative;
  transition: all 0.38s;
  width: fit-content;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 12px;
  }
`

export const PreSaleButton = styled(Button)`
  color: ${({ theme }) => theme.colors.background};
  padding: 0 16px;
  width: fit-content;
  height: 55px;
  margin: 0 18px;
  border-radius: 40px;
  background: ${({ theme }) => theme.colors.rainbow};

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: 500;
  user-select: none;
`
