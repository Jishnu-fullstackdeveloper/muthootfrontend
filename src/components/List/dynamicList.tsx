import * as React from 'react'

import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import * as Icons from '@mui/icons-material'

interface DynamicListProps {
  data: Array<{
    text: string
    icon: string
    children: Array<{ text: string; icon: string }>
  }>
}

const DynamicList: React.FC<DynamicListProps> = ({ data }) => {
  const [openStates, setOpenStates] = React.useState<{
    [key: string]: boolean
  }>({})

  const handleClick = (text: string) => {
    setOpenStates(prev => ({ ...prev, [text]: !prev[text] }))
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons]

    
return IconComponent ? <IconComponent /> : null
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
      subheader={
        <ListSubheader component='div' id='nested-list-subheader'>
          Nested List Items
        </ListSubheader>
      }
    >
      {data.map(item => (
        <React.Fragment key={item.text}>
          <ListItemButton onClick={() => item.children.length && handleClick(item.text)}>
            <ListItemIcon>{renderIcon(item.icon)}</ListItemIcon>
            <ListItemText primary={item.text} />
            {item.children.length > 0 && (openStates[item.text] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          {item.children.length > 0 && (
            <Collapse in={openStates[item.text]} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                {item.children.map(child => (
                  <ListItemButton key={child.text} sx={{ pl: 4 }}>
                    <ListItemIcon>{renderIcon(child.icon)}</ListItemIcon>
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}

export default DynamicList
