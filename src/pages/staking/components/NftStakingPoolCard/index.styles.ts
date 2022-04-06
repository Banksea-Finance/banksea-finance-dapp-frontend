import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'

export const StyledNftStakingPoolCard = styled(Card)`
  width: 100%;
  padding: 24px 24px 36px 24px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 12px;
    width: 100%;
    border-radius: 10px;
  }
`
