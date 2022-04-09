import React from 'react'
import { Text } from '@/contexts/theme/components'
import styled, { CSSProperties } from 'styled-components'
import QueriedData, { QueriedDataProps } from '@/components/QueriedData'

interface Props<T> extends QueriedDataProps<T> {
  label: string
  labelWidth?: CSSProperties['width']
}

const DataItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

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
    
    .value {
      font-size: 16px;
    }
  }
`

const DataItem = <T,>({ label, value, displayFunction, labelWidth }: Props<T>): JSX.Element => {
  return (
    <DataItemContainer>
      <Text fontWeight={500} style={{ width: labelWidth }} className={'label'} color={'textDisabled'}>
        {label}
      </Text>
      <QueriedData
        value={value}
        displayFunction={displayFunction}
        fontSize={'20px'}
        bold
        color={'primary'}
      />
    </DataItemContainer>
  )
}

export { DataItem }
