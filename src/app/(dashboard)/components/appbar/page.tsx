'use client'
import React from 'react'

import Dynamicappbar from '@/components/AppBar/dynamicAppBar'

function page() {
  const pages = ['Products', 'Pricing', 'Blog']
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout']
  const logo = 'LOGO'

  
return (
    <div>
      <Dynamicappbar pages={pages} settings={settings} logo={logo} />
    </div>
  )
}

export default page
