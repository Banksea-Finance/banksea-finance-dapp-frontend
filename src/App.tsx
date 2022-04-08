import React, { useState } from 'react'
import { AppContainer } from '@/App.style'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, ButtonMenu, Card, CardRibbon, Text } from '@/contexts/theme/components'
import { Grid } from '@react-css/grid'
import { TextProps } from '@/contexts/theme/components/Text'
import { BsFillAlarmFill, BsFillArchiveFill } from 'react-icons/bs'
import { CardProps } from '@/contexts/theme/components/Card'

BigNumber.config({
  EXPONENTIAL_AT: 64
})

const NavbarPlaceHolder = styled.div`
  width: 100%;
  
  height: 100px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    height: 68px;
  }
`

const H1 = (props: TextProps) => <Text bold fontSize={'32px'} color={'primary'} {...props} />

const H2 = (props: TextProps) => <Text bold fontSize={'20px'} mt={'8px'} {...props} />

const Buttons: React.FC = () => {
  return (
    <div>
      <H1>Button</H1>
      <H2>Scales</H2>
      <Grid gap={'8px'} columns={'repeat(3, max-content)'} alignItemsEnd>
        <Button scale={'xs'}>
          Xs
        </Button>
        <Button scale={'sm'}>
          Sm
        </Button>

        <Button scale={'md'}>
          Md
        </Button>
      </Grid>
      <H2>Variant</H2>
      <Grid gap={'8px'} columns={'repeat(5, max-content)'}>
        <Button variant={'primary'}>
          Primary
        </Button>
        <Button variant={'secondary'}>
          Secondary
        </Button>
        <Button variant={'primaryContrary'}>
          Primary Contrary
        </Button>
        <Button variant={'tertiary'}>
          Tertiary
        </Button>
        <Button variant={'text'}>
          Text
        </Button>
        <Button variant={'danger'}>
          Danger
        </Button>
        <Button variant={'subtle'}>
          Subtle
        </Button>
        <Button variant={'success'}>
          Success
        </Button>
        <Button disabled>
          Disabled
        </Button>
      </Grid>
      <H2>With Icon</H2>
      <Grid gap={'8px'} columns={'repeat(5, max-content)'}>
        <Button startIcon={<BsFillAlarmFill />}>
          Prefix
        </Button>
        <Button endIcon={<BsFillArchiveFill />}>
          Suffix
        </Button>
      </Grid>
    </div>
  )
}

const ButtonMenus: React.FC = () => {
  const [key, setKey] = useState('1')

  return (
    <div>
      <H1>Button Menu</H1>
      <ButtonMenu activeKey={key} onItemClick={({ key }) => setKey(key!)}>
        <ButtonMenu.Item itemKey={'1'}>Item 1</ButtonMenu.Item>
        <ButtonMenu.Item itemKey={'2'}>Item 2</ButtonMenu.Item>
      </ButtonMenu>
    </div>
  )
}

const Cards: React.FC = () => {
  const StyledCard = (props: CardProps) => <Card width={'200px'} height={'100px'} alignItems={'center'} justifyContent={'center'} {...props} />

  return (
    <div>
      <H1>Card</H1>
      <Grid gap={'16px'} columns={'repeat(3, max-content)'} alignItemsStart>
        <StyledCard>
          <Text>Default</Text>
        </StyledCard>
        <StyledCard plain>
          <Text>Plain (No box shadow)</Text>
        </StyledCard>
        <StyledCard isActive>
          <Text>Active</Text>
        </StyledCard>
        <StyledCard isWarning>
          <Text>Warning</Text>
        </StyledCard>
        <StyledCard isSuccess>
          <Text>Success</Text>
        </StyledCard>
        <StyledCard
          width={400}
          height={200}
          ribbon={<CardRibbon text={'Ribbon'} />}
        >
          With ribbon
        </StyledCard>
      </Grid>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AppContainer id={'app'}>
      <Buttons />
      <ButtonMenus />
      <Cards />
    </AppContainer>
  )
}

export default App
