import React from 'react'
import Button from '@mui/material/Button'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { SxProps, Theme } from '@mui/material/styles'

interface ButtonProps {
  children: React.ReactNode // Use 'children' instead of 'label'
  variant?: 'text' | 'contained' | 'outlined' | 'tonal'
  onClick?: () => void
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
  disabled?: boolean
  icon?: React.ReactNode
  position?: 'start' | 'end'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  label?: string
  sx?: SxProps<Theme>
  size?: 'small' | 'medium' | 'large'
}

const DynamicButton: React.FC<ButtonProps> = ({
  children,
  variant,
  onClick,
  color,
  disabled,
  icon,
  position,
  type,
  className,
  label,
  sx,
  size = 'medium'
}) => {
  return (
    <Button
      sx={{
        borderRadius: '1px solid black',
        ...sx
      }}
      variant={variant}
      onClick={onClick}
      color={color}
      disabled={disabled}
      startIcon={position === 'start' ? icon : undefined}
      endIcon={position === 'end' ? icon : undefined}
      type={type}
      className={className || label}
      size={size}
    >
      {children}
    </Button>
  )
}

export default DynamicButton
