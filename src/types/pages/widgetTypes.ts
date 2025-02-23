export interface CardStatsSquareProps {
  avatarColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' // Updated to MUI color literals
  avatarIcon: string
  stats: string | number
  statsTitle: string
  avatarIconSize?: number
  avatarVariant?: 'rounded' | 'circular' | 'square'
  avatarSize?: number // Changed to number instead of string
  avatarSkin?: 'filled' | 'light' | 'light-static' // Updated to match CustomAvatar
}
export interface CardStatsHorizontalProps {
  avatarColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' // Updated to MUI color literals
  avatarIcon: string
  stats: string | number
  statsTitle: string
  avatarIconSize?: number
  avatarVariant?: 'rounded' | 'circular' | 'square'
  avatarSize?: number // Changed to number instead of string
  avatarSkin?: 'filled' | 'light' | 'light-static' // Updated to match CustomAvatar
  title?: string
}
export interface CardStatsWithAreaChartProps {
  avatarColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' // Updated to MUI color literals
  avatarIcon: string
  stats: string | number
  statsTitle: string
  avatarIconSize?: number
  avatarVariant?: 'rounded' | 'circular' | 'square'
  avatarSize?: number // Changed to number instead of string
  avatarSkin?: 'filled' | 'light' | 'light-static' // Updated to match CustomAvatar
  title?: string
  chartSeries?: any
  chartColor?: 'primary'
}
export interface CardStatsVerticalProps {
  avatarColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' // Updated to MUI color literals
  avatarIcon: string
  stats: string | number
  statsTitle: string
  avatarIconSize?: number
  avatarVariant?: 'rounded' | 'circular' | 'square'
  avatarSize?: number // Changed to number instead of string
  avatarSkin?: 'filled' | 'light' | 'light-static' // Updated to match CustomAvatar
  title?: string
  chartSeries?: any
  chartColor?: 'primary'
  subtitle?: string
  chipText?: string
  chipColor?: string
  chipVariant?: string
}
