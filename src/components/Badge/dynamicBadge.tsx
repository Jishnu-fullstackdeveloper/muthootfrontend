import * as React from 'react'
import Badge from '@mui/material/Badge'
import { SvgIconComponent } from '@mui/icons-material'

interface DynamicBadgeProps {
  badgeContent: number
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  icon: SvgIconComponent
}

export default function DynamicBadge({ badgeContent, color = 'primary', icon: Icon }: DynamicBadgeProps) {
  return (
    <Badge badgeContent={badgeContent} color={color}>
      <Icon color='action' />
    </Badge>
  )
}
