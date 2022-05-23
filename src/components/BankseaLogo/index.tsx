import { Tag } from '@/contexts/theme/components'
import { Flex } from '@react-css/flex'
import React from 'react'
import styled from 'styled-components'

const LogoContainer = styled.img`
  width: 144px;
`

const DevnetTag = styled(Tag)`
  transform: scale(80%);
  position: relative;
  bottom: 10px;
`

const Logo: React.FC<{ width?: string }> = () => {
  return (
    <Flex alignItemsCenter>
      <LogoContainer src={require('@/assets/images/logo.png')} />
      <DevnetTag variant={'subtle'} scale={'M'}>Devnet</DevnetTag>
    </Flex>
  )
}

export default Logo
