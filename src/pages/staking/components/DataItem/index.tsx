import React from 'react'
import Flex from '@react-css/flex'
import { Text } from '@/contexts/theme/components'
import { ClipLoader } from 'react-spinners'
import { UseQueryResult } from 'react-query'
import { CSSProperties } from 'styled-components'

type Props<T> = {
  label: string;
  queryResult: UseQueryResult<T | undefined>,
  displayExpress?: (data: T) => string
  labelWidth?: CSSProperties['width']
}

const DataItem = <T,>({ label, queryResult, displayExpress, labelWidth }: Props<T>): JSX.Element => {
  return (
    <Flex alignItemsCenter>
      <Text mr={'8px'} fontWeight={500} style={{ width: labelWidth }}>
        {label}:
      </Text>
      {
        queryResult.data ? (
          <Text fontSize={'20px'} bold color={'primary'}>
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
    </Flex>
  )
}

export { DataItem }
