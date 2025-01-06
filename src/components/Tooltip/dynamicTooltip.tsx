import * as React from 'react'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'

interface BasicTooltipProps extends Omit<TooltipProps, 'children'> {
  title: string
  children: React.ReactElement // Restrict children to valid React elements
}

const DynamicTooltip: React.FC<BasicTooltipProps> = ({ title, children, ...props }) => {
  return (
    <Tooltip title={title} {...props}>
      {children}
    </Tooltip>
  )
}

export default DynamicTooltip
