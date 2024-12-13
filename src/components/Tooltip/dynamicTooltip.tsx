import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

interface BasicTooltipProps {
  title: string
}

const DynamicTooltip: React.FC<BasicTooltipProps> = ({ title }) => {
  return (
    <Tooltip title={title}>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  )
}

export default DynamicTooltip
