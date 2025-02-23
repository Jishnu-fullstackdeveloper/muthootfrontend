import * as React from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import StarIcon from '@mui/icons-material/Star'
import SendIcon from '@mui/icons-material/Send'
import DraftsIcon from '@mui/icons-material/Drafts'
import MailIcon from '@mui/icons-material/Mail'
import TrashIcon from '@mui/icons-material/Delete'
import SpamIcon from '@mui/icons-material/ReportProblem'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface DynamicDrawerProps {
  menuData: {
    firstList: { text: string; icon: string }[]
    secondList: { text: string; icon: string }[]
  }
}

const DynamicDrawer: React.FC<DynamicDrawerProps> = ({ menuData }) => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'inbox':
        return <InboxIcon />
      case 'star':
        return <StarIcon />
      case 'send':
        return <SendIcon />
      case 'drafts':
        return <DraftsIcon />
      case 'mail':
        return <MailIcon />
      case 'trash':
        return <TrashIcon />
      case 'spam':
        return <SpamIcon />
      default:
        return <InboxIcon />
    }
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menuData.firstList.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{getIcon(icon)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {menuData.secondList.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{getIcon(icon)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div>
      {(['left', 'right', 'top', 'bottom'] as const).map(anchor => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}

export default DynamicDrawer
