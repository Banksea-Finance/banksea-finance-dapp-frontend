import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'

export const StyledNftStakingPoolCard = styled(Card)`
  width: inherit;
  padding: 24px 24px 36px 24px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 12px;
    width: 100%;
    border-radius: 10px;
  }
`

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px 12.5%;
  justify-content: center;
  margin-bottom: 32px;
  justify-items: center;
`
