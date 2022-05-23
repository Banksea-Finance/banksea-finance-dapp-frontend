import React, { cloneElement, isValidElement } from 'react'
import { Card, Text } from '@/contexts/theme/components'
import styled, { CSSProperties } from 'styled-components'
import QueriedData, { QueriedDataProps } from '@/components/QueriedData'
import { CardProps } from '@/contexts/theme/components/Card'
import { useThemeWrapper } from '@/contexts'

interface Props<T> extends QueriedDataProps<T>, Pick<CardProps, 'variant'> {
  icon?: JSX.Element
  label: string
  labelWidth?: CSSProperties['width']
}

const DataItemContainer = styled(Card)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 44px 0 30px 0;
  border-radius: 20px;

  .label:after {
    margin-right: 8px;
  }
  
  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    width: 100%;
    
    .label {
      font-size: 14px;
      
      &:after {
        content: '';
      }
    }
  }
`

const DataItem = <T,>({ label, value, displayFunction, variant, icon }: Props<T>): JSX.Element => {
  const { themeInstance } = useThemeWrapper()

  return (
    <DataItemContainer variant={variant}>
      {isValidElement(icon) && (
        <div style={{ marginBottom: '24px', width: 'fit-content' }}>
          {cloneElement(icon, { width: '48px', color: themeInstance.colors[variant!] } as any)}
        </div>
      )}

      <QueriedData
        value={value}
        displayFunction={displayFunction}
        fontSize={'max(min(30px, 2vw), 18px)'} // [18px, 30px]
        bold
        color={variant}
      />

      <Text fontWeight={500} width={'90%'} textAlign={'center'} className={'label'} color={'textDisabled'}>
        {label}
      </Text>
    </DataItemContainer>
  )
}

export { DataItem }
