import { LayoutProps, SpaceProps } from 'styled-system'
import { Scales } from '../../configs/scales'

export interface InputProps extends SpaceProps, LayoutProps {
  scale?: Scales;
  isSuccess?: boolean;
  isWarning?: boolean;
}
