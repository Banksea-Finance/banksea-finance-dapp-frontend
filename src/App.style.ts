import styled from 'styled-components'

export const AppContainer = styled.div`
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
    opacity: 0;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
  }
`
