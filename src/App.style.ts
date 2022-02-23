import styled from 'styled-components'

export const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.38s;
  min-height: 100vh;
`

export const BackTopButton = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.rainbow};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`
