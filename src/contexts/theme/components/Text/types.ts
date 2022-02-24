import { SpaceProps, TypographyProps } from 'styled-system'
import { Colors } from '@/contexts/theme/configs/types'

export interface TextProps extends SpaceProps, TypographyProps {
  color?: keyof Colors | string;
  fontSize?: string;
  bold?: boolean;
  small?: boolean;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}
