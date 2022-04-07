import styled from 'styled-components'

const DefaultPageContainer = styled.div`
  width: 80%;
  max-width: ${({ theme }) => theme.siteWidth};
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-bottom: 24px;
  
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 16px 1.5vw;
  }
`


export default DefaultPageContainer
