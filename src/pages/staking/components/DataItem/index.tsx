import React from 'react'
import { Text } from '@/contexts/theme/components'
import { ClipLoader } from 'react-spinners'
import { UseQueryResult } from 'react-query'
import styled, { CSSProperties } from 'styled-components'

type Props<T> = {
  label: string
  queryResult: UseQueryResult<T | undefined>
  displayExpress?: (data: T) => string
  labelWidth?: CSSProperties['width']
}

const DataItemContainer = styled.div`
  display: flex;
  align-items: center;
  
  .label:after {
    content: ':';
    margin-right: 8px;
  }
  
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
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

const DataItem = <T,>({ label, queryResult, displayExpress, labelWidth }: Props<T>): JSX.Element => {
  return (
    <DataItemContainer>
      <Text fontWeight={500} style={{ width: labelWidth }} className={'label'}>
        {label}
      </Text>
      {
        queryResult.data ? (
          <Text fontSize={'20px'} bold color={'primary'} className={'value'}>
            {
              displayExpress
                ? displayExpress(queryResult.data)
                : (
                  (queryResult.data as any).toString?.() || queryResult.data
                )
            }
          </Text>
        ) : (
          queryResult.isFetching
            ? <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
            : '-'
        )
      }
    </DataItemContainer>
  )
}

export { DataItem }
