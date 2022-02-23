import React from 'react'
import { Card, Text, Button } from '../'
import { useModal } from '@/contexts/modal'
import { shortenAddress } from '@/utils'
import { DEFAULT_CLUSTER } from '@/contexts'

export const WalletModalContent: React.FC<{ account: string; disconnect: VoidFunction }> = ({
  account,
  disconnect
}) => {
  const { closeModal } = useModal()

  const handleDisconnect = () => {
    disconnect()
    closeModal()
  }

  return (
    <Card padding={'50px'} width={'500px'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Text fontSize={'48px'} fontFamily={'orbitron'} bold marginBottom={'50px'}>
        Wallet
      </Text>
      <Text marginBottom={'30px'}>You are now connected to {shortenAddress(account)}</Text>

      <Text marginBottom={'30px'}>Network: {DEFAULT_CLUSTER}</Text>
      <Button onClick={handleDisconnect}>Disconnect</Button>
    </Card>
  )
}
