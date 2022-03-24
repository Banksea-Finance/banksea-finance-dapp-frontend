import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'

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

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px 12.5%;
  justify-content: center;
  margin-bottom: 32px;
  justify-items: center;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: max-content;
    justify-items: start;
  }
}
`
