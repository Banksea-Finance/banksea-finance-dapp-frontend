import { useEffect, useState } from 'react'
import { useSolanaConnectionConfig } from '@/contexts'

export const useCurrentSlotTime = () => {
  const [time, setTime] = useState<number>()
  const { connection } = useSolanaConnectionConfig()

  useEffect(() => {
    const getTimeFromBlockchain = () => {
      connection
        .getSlot('confirmed')
        .then(slot => {
          return connection.getBlockTime(slot)
        })
        .then(time => {
          if (time) setTime(time)
          else getTimeFromBlockchain()
        })
    }

    getTimeFromBlockchain()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => (prev ? prev + 1 : undefined))
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [])

  return time
}
