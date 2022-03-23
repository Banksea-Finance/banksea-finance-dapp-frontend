import React from 'react'
import { Text } from '../'
import { useModal } from '@/contexts/modal'
import { shortenAddress } from '@/utils'
import { SOLANA_CLUSTER } from '@/contexts'
import { Dialog } from '@/contexts/theme/components'

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
    <Dialog title={'Your Wallet'} onCancel={handleDisconnect} cancelButtonProps={{ children: 'Disconnect' }}>
      <Text textAlign={'center'} fontSize={'18px'} mb={'16px'}>
        You are now connected to <b>{shortenAddress(account)}</b>
      </Text>
      <Text textAlign={'center'} fontSize={'18px'}>
        Current Network: {SOLANA_CLUSTER}
      </Text>
    </Dialog>
  )
}
