import React from 'react'
import { Text, TextProps } from '@banksea-finance/ui-kit'
import { ClipLoader } from 'react-spinners'
import { UseQueryResult } from 'react-query'

export interface QueriedDataProps<T> extends TextProps {
  value: UseQueryResult<T | undefined>
  displayFunction?: (data: T) => string
}

export function QueriedData <T>({ value, displayFunction, ...textProps }: QueriedDataProps<T>): JSX.Element {
  return value.data !== undefined ? (
    <Text {...textProps}>
      {
        displayFunction
          ? displayFunction(value.data)
          : (value.data as any).toString?.() || value.data
      }
    </Text>
  ) : (
    value.isLoading
      ? <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
      : <Text {...textProps}>-</Text>
  )
}
