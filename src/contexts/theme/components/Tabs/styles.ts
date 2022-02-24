import styled, { css } from 'styled-components'
import { width } from 'styled-system'

const Transition = css`
  .fade-enter {
    opacity: 0;
    
    &-active {
      opacity: 1;
    }
  }

  .fade-exit {
    opacity: 1;
    
    &-active {
      opacity: 0;
    }
  }

  .fade-enter-active,
  .fade-exit-active {
    transition: opacity 170ms, transform 170ms;
  }
`

export const StyledTabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  ${Transition}
  ${width}
`
