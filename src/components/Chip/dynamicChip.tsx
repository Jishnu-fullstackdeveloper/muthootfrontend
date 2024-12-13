'use client'

import * as React from 'react'
import Chip from '@mui/material/Chip'

export interface ChipData {
  label: string
  variant?: 'filled' | 'outlined' | 'tonal'
  onClick?: () => void
  onDelete?: () => void
  deleteIcon?: React.ReactElement
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

interface DynamicChipProps {
  label: string
  variant?: 'filled' | 'outlined | tonal'
  onClick?: () => void
  onDelete?: () => void
  deleteIcon?: React.ReactElement
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

export default function DynamicChip({ label, variant, onClick, onDelete, deleteIcon, color }: DynamicChipProps) {
  return (
    <Chip
      label={label}
      variant={variant === 'outlined' ? 'filled' : undefined}
      onClick={onClick}
      onDelete={onDelete}
      deleteIcon={deleteIcon || undefined}
      color={color}
    />
  )
}
