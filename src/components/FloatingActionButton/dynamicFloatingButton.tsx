// DynamicFloatingActionButton.tsx
import * as React from 'react'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NavigationIcon from '@mui/icons-material/Navigation'

// Define prop types
export interface FabButton {
  label: string
  icon: React.ReactNode
  color?: 'primary' | 'secondary' | 'default'
  variant?: 'extended' | 'circular'
  disabled?: boolean
}

interface DynamicFloatingActionButtonProps {
  buttons: FabButton[]
}

export default function DynamicFloatingActionButton({ buttons }: DynamicFloatingActionButtonProps) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      {buttons.map((button, index) => (
        <Fab
          key={index}
          color={button.color || 'default'}
          aria-label={button.label.toLowerCase()}
          variant={button.variant || 'circular'}
          disabled={button.disabled}
        >
          {button.icon}
          {button.variant === 'extended' && button.label}
        </Fab>
      ))}
    </Box>
  )
}
