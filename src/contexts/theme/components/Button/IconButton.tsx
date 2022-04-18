import styled from 'styled-components'
import Button from './Button'
import { BaseButtonProps, PolymorphicComponent } from './types'

const IconButton: PolymorphicComponent<BaseButtonProps, 'button'> = styled(Button)<BaseButtonProps>`
  padding: 0;
  width: ${({ scale }) => (scale === 'M' ? '32px' : '48px')};
`

export default IconButton
