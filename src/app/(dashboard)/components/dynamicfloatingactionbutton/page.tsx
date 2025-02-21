
import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NavigationIcon from '@mui/icons-material/Navigation'

import DynamicFloatingActionButton from '@/components/FloatingActionButton/dynamicFloatingButton'
import type { FabButton } from '@/components/FloatingActionButton/dynamicFloatingButton';

function Page() {
  const buttons: FabButton[] = [
    {
      label: 'Add',
      icon: <AddIcon />,
      color: 'primary'
    },
    {
      label: 'Edit',
      icon: <EditIcon />,
      color: 'secondary'
    },
    {
      label: 'Navigate',
      icon: <NavigationIcon />,
      variant: 'extended'
    },
    {
      label: 'Like',
      icon: <FavoriteIcon />,
      disabled: true
    }
  ]

  return (
    <div>
      <DynamicFloatingActionButton buttons={buttons} />
    </div>
  )
}

export default Page
