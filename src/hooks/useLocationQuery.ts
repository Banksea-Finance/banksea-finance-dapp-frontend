import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export const useLocationQuery = (key: string): string | undefined => {
  return new URLSearchParams(useLocation().search).get(key) ?? undefined
}

type UseLocationQueriesProps = Array<{
  key: string
  defaultValue?: string
}>

export const useLocationQueries = (props: UseLocationQueriesProps): Array<string> => {
  const { search } = useLocation()

  return useMemo(
    () =>
      props.map(({ key, defaultValue }) => {
        return new URLSearchParams(search).get(key) ?? defaultValue ?? ''
      }),
    [search]
  )
}
