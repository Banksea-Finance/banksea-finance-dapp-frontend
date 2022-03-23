import React from 'react'
import NftStakingPoolCard from '@/pages/staking/components/NftStakingPoolCard'
import { NFT_STAKING_POOLS } from '@/hooks/programs/useStaking/constants/nft'

const NFTStakingModule: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      {NFT_STAKING_POOLS.map((p, index) => (
        <NftStakingPoolCard {...p} key={index} />
      ))}
    </div>
  )
}

export default NFTStakingModule
