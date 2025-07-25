'use client'

import React, { useState } from 'react'

// import { useRouter } from 'next/navigation'

import { IconButton, InputAdornment, Box, Card, CardContent, Button, Tabs, Tab } from '@mui/material'

import DynamicTextField from '@/components/TextField/dynamicTextField'

// import { ROUTES } from '@/utils/routes'
import DesignationRole from './DesignationRole'
import GroupRole from './GroupRole'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const UserRolesAndPermissionList: React.FC = () => {
  // const router = useRouter()
  const [searchText, setSearchText] = useState<string>('')

  // const [ setDebouncedSearchText] = useState<string>('')
  const [tabValue, setTabValue] = useState<number>(0)

  // Debounce search input
  // useEffect(() => {
  //   const timer = setTimeout(() => setDebouncedSearchText(searchText), 500)

  //   return () => clearTimeout(timer)
  // }, [searchText])

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
  }

  // Handle add button based on active tab
  // const handleAdd = (): void => {
  //   const route = tabValue === 0 ? ROUTES.USER_MANAGEMENT.DESIGNATION_ROLE_ADD : ROUTES.USER_MANAGEMENT.GROUP_ROLE_ADD

  //   router.push(route)
  // }

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <DynamicTextField
              label='Search Roles'
              variant='outlined'
              onChange={handleSearch}
              value={searchText}
              placeholder='Search roles...'
              size='small'
              sx={{ minWidth: { xs: '100%', sm: 300 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {searchText && (
                      <IconButton
                        aria-label='Clear search'
                        size='small'
                        onClick={() => setSearchText('')}
                        edge='end'
                        sx={{ color: 'text.secondary' }}
                      >
                        <i className='tabler-x' style={{ fontSize: '1rem' }} />
                      </IconButton>
                    )}
                    <i className='tabler-search' style={{ fontSize: '1.25rem' }} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant='contained'
              color='primary'
              
              // onClick={handleAdd}
              startIcon={<i className='tabler-plus' />}
              sx={{ borderRadius: 1 }}
            >
              Add Role
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label='Role type tabs'>
          <Tab label='Designation Roles' id='tab-0' aria-controls='tabpanel-0' />
          <Tab label='Group Roles' id='tab-1' aria-controls='tabpanel-1' />
        </Tabs>
      </Card>

      <Card>
        <TabPanel value={tabValue} index={0}>
          <DesignationRole searchText='' />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <GroupRole searchText='' />
        </TabPanel>
      </Card>
    </>
  )
}

export default UserRolesAndPermissionList
