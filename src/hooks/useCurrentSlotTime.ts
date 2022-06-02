import { useEffect, useState } from 'react'
import { useSolanaConnectionConfig } from '@/contexts'

export const useCurrentSlotTime = (seconds = 5) => {
  const [time, setTime] = useState<number>()
  const { connection } = useSolanaConnectionConfig()

  useEffect(() => {
    const callback = () => {
      connection
        .getSlot('confirmed')
        .then(slot => {
          return connection.getBlockTime(slot)
        })
        .then(time => {
          if (time) setTime(time)
        })
    }

    const interval = setInterval(callback, seconds * 1000)

    callback()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return time
}
