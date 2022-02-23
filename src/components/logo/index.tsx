import React from 'react'

const Logo: React.FC<{ width?: string }> = ({ width }) => {
  return (
    <div style={{ width: width || 'fit-content' }}>
      <img src={require('@/assets/images/logo.png')} style={{ width: '100%' }} />
    </div>
  )
}

export default Logo
