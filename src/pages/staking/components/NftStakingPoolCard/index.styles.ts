import styled from 'styled-components'
import { Card } from '@/contexts/theme/components'

export const StyledNftStakingPoolCard = styled(Card)`
  width: inherit;
  padding: 24px 24px 36px 24px;
  transition: all 0.38s;
`

export const NftCollectionImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  
  margin-right: 16px;
`

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px 12.5%;
  justify-content: center;
  margin-bottom: 32px;
  justify-items: center;
`
