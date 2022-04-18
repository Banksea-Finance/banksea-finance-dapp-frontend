import { scales } from '../../configs/scales'
import { Variant, variants } from './types'

export const scaleVariants = {
  [scales.L]: {
    height: '48px',
    padding: '0 24px',
    fontSize: '18px'
  },
  [scales.M]: {
    height: '36px',
    padding: '0 16px',
    fontSize: '16px'
  },
  [scales.S]: {
    height: '28px',
    fontSize: '14px',
    padding: '0 12px'
  }
}

export const styleVariants: Record<Variant, any> = {
  [variants.PRIMARY]: {
    backgroundColor: 'primary',
    color: 'textContrary',
  },
  [variants.PRIMARY_CONTRARY]: {
    backgroundColor: 'primaryContrary',
    color: 'textContrary',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'secondary',
    borderColor: 'primary',
    color: 'textContrary',
    ':disabled': {
      backgroundColor: 'transparent',
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: 'tertiary',
    boxShadow: 'none',
    color: 'primary',
    border: '1px #cdcdcd solid',
  },
  [variants.SUBTLE]: {
    backgroundColor: 'textSubtle',
    color: 'white',
  },
  [variants.DANGER]: {
    backgroundColor: 'failure',
    color: 'white',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'primary',
    boxShadow: 'none',
  },
}
