import { useCallback, useState } from 'react'

const usePageQuery = () => {
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)

  const handleChange = useCallback(
    (page: number, pageSize?: number) => {
      setCurrent(page)
      pageSize && setSize(pageSize)
    },
    [],
  )

  return {
    current,
    size,
    handleChange
  }

}

export default usePageQuery
