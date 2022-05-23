import React from 'react'
import { Text } from '@/contexts/theme/components'
import { ClipLoader } from 'react-spinners'
import { UseQueryResult } from 'react-query'
import { TextProps } from '@/contexts/theme/components/Text'

export interface QueriedDataProps<T> extends TextProps {
  value: UseQueryResult<T | undefined>
  displayFunction?: (data: T) => string
}

const QueriedData = <T,>({ value, displayFunction, ...textProps }: QueriedDataProps<T>): JSX.Element => {
  return value.data ? (
    <Text {...textProps}>
      {
        displayFunction
          ? displayFunction(value.data)
          : (
            (value.data as any).toString?.() || value.data
          )
      }
    </Text>
  ) : (
    value.isFetching
      ? <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
      : <Text {...textProps}>-</Text>
  )
}

export default QueriedData