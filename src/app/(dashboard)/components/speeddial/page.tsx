import React from 'react'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined'
import SaveIcon from '@mui/icons-material/Save'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DynamicSpeedDial from '@/components/SpeedDial/dynamicSpeedDial'

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' }
]

const ParentComponent = () => {
  return (
    <div>
      <DynamicSpeedDial ariaLabel='SpeedDial openIcon example' openIcon={<EditIcon />} actions={actions} />
    </div>
  )
}

export default ParentComponent
