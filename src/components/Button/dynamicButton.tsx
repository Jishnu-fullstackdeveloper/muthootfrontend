import React from 'react'
import Button from '@mui/material/Button'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { SxProps, Theme } from '@mui/material/styles'

interface ButtonProps {
  children: React.ReactNode // Use 'children' instead of 'label'
  variant: 'text' | 'contained' | 'outlined' | 'tonal'
  onClick?: () => void
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
  disabled?: boolean
  icon?: React.ReactNode
  position?: 'start' | 'end'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  label?: string
  sx?: SxProps<Theme>
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
  sx
}) => {
  return (
    <Button
      sx={{
        borderRadius: custom_theme_settings?.theme?.primary_button?.cornerRadius || '5px'
      }}
      variant={variant}
      onClick={onClick}
      color={color}
      disabled={disabled}
      startIcon={position === 'start' ? icon : undefined}
      endIcon={position === 'end' ? icon : undefined}
      type={type}
      className={className || label} // Pass className for custom styling if needed
    >
      {children}
    </Button>
  )
}

export default DynamicButton
