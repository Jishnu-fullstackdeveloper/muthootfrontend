'use client'
import React, { useEffect, useState } from 'react'
import DynamicTable from '@/components/Table/dynamicTable'
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
import { ColumnDef } from '@tanstack/react-table'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicButton from '@/components/Button/dynamicButton'
import { fetchUserRolebyId } from '@/redux/userRoleSlice'
import CustomRoles from '@/components/Dialog/addRolesDialog'
import CustomFilters from './FilterDialog'
import { Person } from '@/components/Modifiedtable/modifiedDynamicTable'
import { useRouter } from 'next/navigation'

function UserRoleListing() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false)

  const [tableData, setTableData] = useState<any[]>([
    {
      id: 1,
      designation: 'HR',
      department: 'IT',
      category:'ABC',
      band:'ABCD',
     
      // dropdownValue: 'Admin'
    },
    {
      id: 1,
      designation: 'Manager',
      department: 'IT',
      category:'ABC',
      band:'ABCD',
     
      // dropdownValue: 'Admin'
    },
   
  ])
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

  const handleAddRole = (newRole: Record<string, any>) => {
    setTableData(prev => [...prev, { id: tableData.length + 1, ...newRole }]) // Generate a new ID and add the role
  }

  const handleApplyFilters = (filters: Record<string, any>) => {
    setSelectedFilters(filters)

    const filteredData = tableData?.filter((user: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        return user[key]?.toString().toLowerCase() === value.toLowerCase()
      })
    })

    setTableData(filteredData)
    setAddMoreFilters(false)
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

  const router = useRouter()
  const handleAddUserRole = () => {
    router.push('/user-roles/add/new-bucket')
  }


  const  handleEditUserRole = (id: number) => {
    router.push(`/bucket-role/edit`)
  }
  useEffect(() => {
    if (selectedRole.name && selectedRole.description && selectedRole.dropdownValue) {
      setTableData(prev => [
        ...prev,
        {
          id: tableData.length + 1,
          name: selectedRole.name,
          description: selectedRole.description,
          band:selectedRole.band,
          dropdownValue: selectedRole.dropdownValue
        }
      ])
    }
  }, [selectedRole])

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
    { accessorKey: 'id', header: 'No' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'band', header: 'band' },
   
    {
      header: 'Actions',
      meta: { className: 'sticky right-0' },
      cell: (info: any) => (
        <div>
          <IconButton aria-label='view' onClick={() => handleView(info.row.original)} sx={{ fontSize: 18 }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleEditUserRole()
            }}
            sx={{
              minWidth: 'auto',
              padding: 1,
              backgroundColor: 'transparent',
              border: 'none',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            <i className='tabler-edit' />
          </IconButton>
          <IconButton
            aria-label="Delete Bucket"
            // onClick={(e) => {
            //   e.stopPropagation()
            //   // handleDeleteBucket(row.original.id)
            // }}
            sx={{
              minWidth: 'auto',
              padding: 1,
              backgroundColor: 'transparent',
              border: 'none',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            <i className='tabler-trash' />
          </IconButton>
        </div>
      )
    }
  ]

  const headerMapping: Record<string, string> = {
    id: 'No',
    designation: 'Designation',
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

        <CustomRoles
          open={addMoreRoles}
          setOpen={setAddMoreRoles}
          selectedFilters={selectedFilters}
          setSelectedRole={setSelectedRole}
          onApplyRoles={handleApplyRoles}
          onAddRole={handleAddRole}
        />

        <CustomFilters
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
          onAddRole={handleAddRole}
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

      <DynamicTable columns={columns} data={tableData} />

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

export default UserRoleListing
