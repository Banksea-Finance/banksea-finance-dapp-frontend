import React from 'react'

export const AprSvg: React.FC<{ color?: string }> = ({ color = 'white' }) => {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29 13L13 29"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18.33C16.8391 18.33 18.33 16.8391 18.33 15C18.33 13.1609 16.8391 11.67 15 11.67C13.1609 11.67 11.67 13.1609 11.67 15C11.67 16.8391 13.1609 18.33 15 18.33Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M27 30.33C28.8391 30.33 30.33 28.8391 30.33 27C30.33 25.1609 28.8391 23.67 27 23.67C25.1609 23.67 23.67 25.1609 23.67 27C23.67 28.8391 25.1609 30.33 27 30.33Z"
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M21 41C32.0457 41 41 32.0457 41 21C41 9.9543 32.0457 1 21 1C9.9543 1 1 9.9543 1 21C1 32.0457 9.9543 41 21 41Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
