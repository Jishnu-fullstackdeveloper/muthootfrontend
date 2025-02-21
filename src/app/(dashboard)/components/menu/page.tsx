'use client'
import React from 'react'

import DynamicMenu from '@/components/Menu/dynamicMenu'

function Page() {
  const menuItems = [
    { label: 'Profile', onClick: () => console.log('Profile clicked') },
    { label: 'My account', onClick: () => console.log('My account clicked') },
    { label: 'Logout', onClick: () => console.log('Logout clicked') }
  ]

  return (
    <div>
      <DynamicMenu menuItems={menuItems} />
    </div>
  )
}

export default Page
