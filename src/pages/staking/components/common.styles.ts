import styled from 'styled-components'

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 16px 12.5%;
  justify-content: center;
  margin-bottom: 32px;
  justify-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
    margin-left: 0;
    grid-template-columns: 50% 50%;
    justify-items: start;
    justify-content: center;
    gap: 16px 32px;
  }
`
