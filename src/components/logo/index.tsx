import React from 'react'
import styled from 'styled-components'

const LogoContainer = styled.img`
  width: 144px;
`

const Logo: React.FC<{ width?: string }> = ({ width }) => {
  return (
    <LogoContainer src={require('@/assets/images/logo.png')} />
  )
}

export default Logo
