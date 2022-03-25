import { Button, Text } from '@/contexts/theme/components'
import React from 'react'
import { ButtonProps } from '@/contexts/theme/components/Button'
import { useSolanaWeb3 } from '@/contexts'
import ReactTooltip from 'react-tooltip'

const WalletRequiredButton: React.FC<ButtonProps> = props => {
  const { account } = useSolanaWeb3()

  return (
    <div>
      <a data-for={'a'} data-tip={true}>
        <Button {...props} disabled={!account} />
      </a>
      {
        !account && (
          <ReactTooltip id={'a'} place="top" type="dark" effect="solid">
            <Text color={'textContrary'}>Need wallet connecting</Text>
          </ReactTooltip>
        )
      }
    </div>
  )
}

export { WalletRequiredButton }
