import React from 'react'

import DynamicTooltip from '@/components/Tooltip/dynamicTooltip'

function Page() {
  const tooltipTitle = 'Remove item'

  return (
    <div>
      <DynamicTooltip title={tooltipTitle} />
    </div>
  )
}

export default Page
