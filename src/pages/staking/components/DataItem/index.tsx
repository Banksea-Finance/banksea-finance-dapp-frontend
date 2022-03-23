import React from 'react'
import Flex from '@react-css/flex'
import { Text } from '@/contexts/theme/components'
import { ClipLoader } from 'react-spinners'

const DataItem: React.FC<{ label: string; loading: boolean; value: string }> = ({ label, loading, value }) => {
  return (
    <Flex alignItemsCenter>
      <Text mr={'8px'} fontWeight={500}>{label}:</Text>
      {loading ? (
        <ClipLoader color={'#abc'} size={16} css={'position: relative; top: 2px; left: 4px;'} />
      ) : (
        <Text fontSize={'20px'} bold color={'primary'}>
          {value}
        </Text>
      )}
    </Flex>
  )
}

export { DataItem }
