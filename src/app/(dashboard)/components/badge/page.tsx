'use client'
import React, { useState } from 'react'

import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'

import DynamicBadge from '@/components/Badge/dynamicBadge'

function Page() {
  const [badgeCount, setBadgeCount] = useState(4)
  const [icon, setIcon] = useState(() => MailIcon)
  const [color, setColor] = useState<'primary' | 'secondary'>('primary')

  return (
    <div>
      <DynamicBadge badgeContent={badgeCount} icon={icon} color={color} />
    </div>
  )
}

export default Page
