'use client'
import React, { useEffect, useState } from 'react'
import DynamicTable, { Person } from '@/components/Table/dynamicTable'
import {
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  Box
} from '@mui/material'
import debounce from 'lodash/debounce'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { fetchUser, fetchUserbyId } from '@/redux/userManagementSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useSelector } from 'react-redux'
import { ColumnDef } from '@tanstack/react-table'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicButton from '@/components/Button/dynamicButton'
import JobListingCustomFilters from '@/components/Dialog/filterDialog'
import { userRoleData } from '@/shared/userRoleData'
import { fetchUserRolebyId } from '@/redux/userRoleSlice'
import CustomRoles from '@/components/Dialog/addRolesDialog'

function Page() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [addMoreFilters, setAddMoreFilters] = useState(false)
  const [addMoreRoles, setAddMoreRoles] = useState(false)
  const dispatch = useAppDispatch()
  const { getUserRoleData }: any = useAppSelector((state: any) => state.userRoleReducer)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [selectedRole, setSelectedRole] = useState<Record<string, any>>({})

  const formatDate = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleDateString('en-US')
  }

  const handleView = (row: Person) => {
    setSelectedRow(row)
    setOpenDialog(true)
  }

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    console.log('Applied Filters:', filters)
    const params: any = {
      limit: 10,
      search: debouncedSearch,
      filter: filters
    }
    dispatch(fetchUser(params))
  }

  const handleApplyRoles = (filters: Record<string, string[]>) => {
    console.log('Applied Filters:', filters)
    const params: any = {
      limit: 10,
      search: debouncedSearch,
      filter: filters
    }
    dispatch(fetchUser(params))
  }

  useEffect(() => {
    const handler = debounce((text: string) => {
      setDebouncedSearch(text)
    }, 300)

    handler(searchText)

    return () => {
      handler.cancel()
    }
  }, [searchText])

  useEffect(() => {
    let params: any = {
      limit: 10,
      search: debouncedSearch,
      filter: ''
    }
    dispatch(fetchUser(params))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    if (selectedRow?.id) {
      console.log('Fetching user by ID:', selectedRow.id)
      const params = { id: selectedRow.id }
      dispatch(fetchUserRolebyId(params))
    }
  }, [selectedRow, dispatch])

  useEffect(() => {
    if (getUserRoleData?.data) {
      setTableData(getUserRoleData.data)
    }
  }, [getUserRoleData])

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'id', header: 'User ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      header: 'Actions',
      meta: { className: 'sticky right-0' },
      cell: (info: any) => (
        <div>
          <IconButton aria-label='view' onClick={() => handleView(info.row.original)} sx={{ fontSize: 18 }}>
            <VisibilityIcon />
          </IconButton>
        </div>
      )
    }
  ]

  const headerMapping: Record<string, string> = {
    id: 'User Id',
    name: 'Name',
    description: 'Description'
  }

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        User Role
      </Typography>
      <div className='flex items-center gap-4 bg-white p-4 my-4 rounded-xl'>
        <DynamicTextField
          id='searchId'
          label='Search'
          variant='outlined'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder='Search...'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                <i className='tabler-search text-xxl' />
              </InputAdornment>
            )
          }}
        />

        <JobListingCustomFilters
          open={addMoreFilters}
          setOpen={setAddMoreFilters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onApplyFilters={handleApplyFilters}
        />
        <DynamicButton
          label='Add more filters'
          variant='tonal'
          icon={<i className='tabler-plus' />}
          position='start'
          children='Add more filters'
          onClick={() => setAddMoreFilters(true)}
          sx={{ minWidth: 'auto' }}
        />
        <CustomRoles
          open={addMoreRoles}
          setOpen={setAddMoreRoles}
          selectedFilters={selectedFilters}
          setSelectedRole={setSelectedRole}
          onApplyRoles={handleApplyRoles}
        />
        <DynamicButton
          label='Add Roles'
          variant='tonal'
          icon={<i className='tabler-plus' />}
          position='start'
          children='Add Roles'
          onClick={() => setAddMoreRoles(true)}
          sx={{ minWidth: 'auto' }}
        />
      </div>

      <DynamicTable columns={columns} data={getUserRoleData} />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedRow ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              {Object.entries(selectedRow)
                .filter(([key]) => key !== 'id')
                .map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Dynamically map header labels, if available */}
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{headerMapping[key] || key}</div>
                    <div>{value ? value.toString() : 'N/A'}</div>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No details available</p>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Page
