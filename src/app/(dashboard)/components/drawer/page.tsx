'use client'
import React from 'react'

import DynamicDrawer from '@/components/Drawer/dynamicDrawer'

function page() {
  const menuData = {
    firstList: [
      { text: 'Inbox', icon: 'inbox' },
      { text: 'Starred', icon: 'star' },
      { text: 'Send email', icon: 'send' },
      { text: 'Drafts', icon: 'drafts' }
    ],
    secondList: [
      { text: 'All mail', icon: 'mail' },
      { text: 'Trash', icon: 'trash' },
      { text: 'Spam', icon: 'spam' }
    ]
  }

  return (
    <div>
      <DynamicDrawer menuData={menuData} />
    </div>
  )
}

export default page
