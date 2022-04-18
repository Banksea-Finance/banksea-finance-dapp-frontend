import { scales } from '../../configs/scales'
import { variants } from './types'

export const scaleVariants = {
  [scales.S]: {
    padding: '2px 6px',
    fontSize: '14px'
  },
  [scales.M]: {
    padding: '4px 10px',
    fontSize: '16px'
  },
  [scales.L]: {
    padding: '6px 12px',
    fontSize: '20px'
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: 'primary',
  },
  [variants.PRIMARY_CONTRARY]: {
    backgroundColor: 'primaryContrary',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'secondary',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
  },
  [variants.TEXTDISABLED]: {
    backgroundColor: 'textDisabled',
  },
  [variants.TEXTSUBTLE]: {
    backgroundColor: 'textSubtle',
  },
  [variants.FAILURE]: {
    backgroundColor: 'failure',
  },
  [variants.WARNING]: {
    backgroundColor: 'warning',
  },
}
