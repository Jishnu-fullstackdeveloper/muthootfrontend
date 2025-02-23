// MUI imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import type { CardStatsSquareProps } from '@/types/pages/widgetTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// interface CardStatsSquareProps {
//   avatarColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' // Updated to MUI color literals
//   avatarIcon: string
//   stats: string | number
//   statsTitle: string
//   avatarIconSize?: number
//   avatarVariant?: 'rounded' | 'circular' | 'square'
//   avatarSize?: number // Changed to number instead of string
//   avatarSkin?: 'filled' | 'light' | 'light-static' // Updated to match CustomAvatar
// }

const CardStatsSquare = (props: CardStatsSquareProps) => {
  // Props
  const { avatarColor, avatarIcon, stats, statsTitle, avatarIconSize, avatarVariant, avatarSize, avatarSkin } = props

  return (
    <Card>
      <CardContent className='flex flex-col items-center gap-2'>
        <CustomAvatar color={avatarColor} skin={avatarSkin} variant={avatarVariant} size={avatarSize}>
          <i className={classnames(avatarIcon, `text-[${avatarIconSize || 16}px]`)} />
        </CustomAvatar>
        <div className='flex flex-col items-center gap-1'>
          <Typography variant='h5'>{stats}</Typography>
          <Typography color='text.secondary'>{statsTitle}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatsSquare
