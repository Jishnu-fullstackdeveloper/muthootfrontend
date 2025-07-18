// src/components/DirectionalIcon.tsx
import React from 'react'

interface DirectionalIconProps {
  ltrIconClass: string
  rtlIconClass: string
}

const DirectionalIcon = ({ ltrIconClass, rtlIconClass }: DirectionalIconProps) => {
  console.log(rtlIconClass)

  // Simple implementation (adjust as needed)
  return <i className={ltrIconClass} />
}

export default DirectionalIcon
