import React from 'react'

import { Stack } from '@mui/material'

import DynamicAvatar from '@/components/Avatar/dynamicAvatar'

function Page() {
  return (
    <Stack direction='column' gap={5}>
      <DynamicAvatar
        avatars={[
          {
            src: '/images/avatars/1.png',
            alt: 'User 1',
            fallbackText: 'U1'
          }
        ]}
        size={60}
      />
      <DynamicAvatar
        avatars={[
          { src: '/images/avatars/1.png', alt: 'User 1' },
          { fallbackText: 'A' },
          { fallbackText: 'B' },
          { src: '/images/avatars/1.png', alt: 'User 2' }
        ]}
        maxGroup={3}
        size={40}
      />
    </Stack>
  )
}

export default Page
