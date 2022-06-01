import styled from 'styled-components'

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 22.9%);
  width: 100%;
  justify-content: space-between;
  margin-bottom: 32px;
  justify-items: center;

  ${({ theme }) => theme.mediaQueries.maxMd} {
    width: 100%;
    grid-template-columns: 49% 49%;
    justify-items: start;
    justify-content: space-between;
    grid-gap: 8px 0;
  }
`
