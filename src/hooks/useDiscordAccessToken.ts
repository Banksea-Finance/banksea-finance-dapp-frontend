import useLocationHash from '@/hooks/useLocationHash'
import { useMemo } from 'react'

const useDiscordAccessToken = () => {
  const locationHash = useLocationHash()

  return useMemo(
    () => {
      return locationHash.get('access_token')
    }, [locationHash]
  )
}

export default useDiscordAccessToken
