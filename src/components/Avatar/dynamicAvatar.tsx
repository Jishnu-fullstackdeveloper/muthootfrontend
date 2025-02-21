'use client'
import type { FC} from 'react';
import React, { useState } from 'react'

import { Avatar, AvatarGroup } from '@mui/material'

interface AvatarItem {
  src?: string
  alt?: string
  fallbackText?: string
}

interface DynamicAvatarProps {
  avatars: AvatarItem[]
  maxGroup?: number
  size?: number
}

const DynamicAvatar: FC<DynamicAvatarProps> = ({ avatars, maxGroup = 4, size = 40 }) => {
  if (avatars.length === 1) {
    const { src, alt = 'Avatar', fallbackText = '?' } = avatars[0]
    const [hasError, setHasError] = useState(false)

    return (
      <Avatar
        src={!hasError ? src : undefined}
        alt={alt}
        onError={() => setHasError(true)}
        sx={{
          width: size,
          height: size,
          bgcolor: !src || hasError ? 'primary.main' : 'transparent',
          fontSize: size / 2
        }}
      >
        {(!src || hasError) && fallbackText}
      </Avatar>
    )
  }

  return (
    <AvatarGroup max={maxGroup}>
      {avatars.map((avatar, index) => {
        const [hasError, setHasError] = React.useState(false)

        
return (
          <Avatar
            key={index}
            src={!hasError ? avatar.src : undefined}
            alt={avatar.alt || `Avatar ${index + 1}`}
            onError={() => setHasError(true)}
            sx={{
              width: size,
              height: size,
              bgcolor: !avatar.src || hasError ? 'primary.main' : 'transparent',
              fontSize: size / 2
            }}
          >
            {(!avatar.src || hasError) && avatar.fallbackText}
          </Avatar>
        )
      })}
    </AvatarGroup>
  )
}

export default DynamicAvatar
