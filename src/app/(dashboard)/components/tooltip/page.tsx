import DynamicTooltip from '@/components/Tooltip/dynamicTooltip'
import React from 'react'

function Page() {
  const tooltipTitle = 'Remove item'

  return (
    <div>
      <DynamicTooltip title={tooltipTitle} />
    </div>
  )
}

export default Page
