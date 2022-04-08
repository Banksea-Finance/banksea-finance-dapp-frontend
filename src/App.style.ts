import styled from 'styled-components'

export const AppContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  padding: 0 32px;
  
  display: grid;
  row-gap: 48px;

  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.38s;

  .fade-enter {
    opacity: 0;
    transform: translate(-75px, 0);
    z-index: 1;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transform: translate(0, 0);

    transition: opacity 250ms ease-out, transform 300ms ease;
  }

  .fade-exit {
    display: none;
  }

  .fade-exit.fade-exit-active {
    display: none;
  }
`
