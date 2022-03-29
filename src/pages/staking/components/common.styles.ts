import styled from 'styled-components'

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px 12.5%;
  justify-content: center;
  margin-bottom: 32px;
  justify-items: center;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: 40% 60%;
    justify-items: start;
    justify-content: space-between;
    gap: 16px 0;
  }
}
`
