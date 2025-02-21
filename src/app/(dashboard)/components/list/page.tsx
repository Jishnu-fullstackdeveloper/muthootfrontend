'use client'

import React from 'react'

import DynamicList from '@/components/List/dynamicList'

const data = [
  { text: 'Sent mail', icon: 'SendIcon', children: [] },
  { text: 'Drafts', icon: 'DraftsIcon', children: [] },
  {
    text: 'Inbox',
    icon: 'InboxIcon',
    children: [{ text: 'Starred', icon: 'StarBorder' }]
  }
]

function Page() {
  return (
    <div>
      <DynamicList data={data} />
    </div>
  )
}

export default Page
