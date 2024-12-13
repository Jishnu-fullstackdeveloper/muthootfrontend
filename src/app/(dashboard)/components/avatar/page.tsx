import React from 'react'
import DynamicAvatar from '@/components/Avatar/dynamicAvatar'
import { Stack } from '@mui/material'

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
