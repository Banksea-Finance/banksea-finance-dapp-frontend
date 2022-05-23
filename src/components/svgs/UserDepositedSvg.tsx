import React from 'react'

export const UserDepositedSvg: React.FC<{ color?: string }> = ({ color = 'white' }) => (
  <svg width="38" height="42" viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 23.16C25.1193 23.16 30.08 18.1993 30.08 12.08C30.08 5.96067 25.1193 1 19 1C12.8807 1 7.92004 5.96067 7.92004 12.08C7.92004 18.1993 12.8807 23.16 19 23.16Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M1.15002 41C1.15002 31.14 9.14 23.15 19 23.15C28.86 23.15 36.85 31.14 36.85 41"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 41V23.15"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
