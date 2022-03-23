import styled from 'styled-components'
import { Card, Text } from '@/contexts/theme/components'

export const StyledTokenStakingPoolCard = styled(Card)`
  width: inherit;
  padding: 24px;
`

export const CurrencyIconImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;

  & + & {
    margin-left: 10px;
  }
`

export const CurrencyName = styled(Text)`
  margin-left: 16px;
  font-weight: 600;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: center;
  gap: 16px 12.5%;
  margin-bottom: 32px;
  justify-items: start;
`
