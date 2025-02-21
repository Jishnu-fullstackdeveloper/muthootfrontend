import type { ReactNode, FC, CSSProperties, JSX } from 'react';
import React from 'react'

import { Card, CardContent, CardActions } from '@mui/material'

interface DynamicCardProps {
  cardHeader?: ReactNode
  cardBody?: ReactNode
  cardFooter?: ReactNode
  sx?: {
    base?: CSSProperties
    header?: CSSProperties
    body?: CSSProperties
    footer?: CSSProperties
  }
}

const DynamicCard: FC<DynamicCardProps> = ({ cardHeader, cardBody, cardFooter, sx = {} }): JSX.Element => {
  return (
    <Card sx={sx.base}>
      {cardHeader && <CardContent sx={sx.header}>{cardHeader}</CardContent>}
      {cardBody && <CardContent sx={sx.body}>{cardBody}</CardContent>}
      {cardFooter && <CardActions sx={sx.footer}>{cardFooter}</CardActions>}
    </Card>
  )
}

export default DynamicCard
