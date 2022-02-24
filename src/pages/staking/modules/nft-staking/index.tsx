import React from 'react'
import NftStakingPoolCard from '@/pages/staking/components/NftStakingPoolCard'
import { BANKSEA_NFT_COLLECTIONS } from '@/hooks/programs/useCandyMachine/helpers/constant'

const NFTStakingModule: React.FC = () => {
  return (
    <div style={{ display: 'grid', rowGap: '20px' }}>
      {
        BANKSEA_NFT_COLLECTIONS.map((p, index) => (<NftStakingPoolCard {...p} key={index} />))
      }
    </div>
  )
}

export default NFTStakingModule
