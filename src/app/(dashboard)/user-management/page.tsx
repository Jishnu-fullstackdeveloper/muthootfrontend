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
  TextField,
  InputAdornment,
  Box,
  MenuItem
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { fetchUser, fetchUserbyId } from '@/redux/userManagementSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useSelector } from 'react-redux'
import { ColumnDef } from '@tanstack/react-table'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicButton from '@/components/Button/dynamicButton'
import DynamicSelect from '@/components/Select/dynamicSelect'
import JobListingCustomFilters from '@/components/Dialog/filterDialog'
import { debounce } from 'lodash'

function Page() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [addMoreFilters, setAddMoreFilters] = useState(false)
  const dispatch = useAppDispatch()
  const { getUserData }: any = useAppSelector((state: any) => state.userManagementReducer)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})

  const formatDate = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleDateString('en-US')
  }

  const handleView = (row: Person) => {
    setSelectedRow(row)
    setOpenDialog(true)
  }

  const handleApplyFilters = (filters: Record<string, any>) => {
    setSelectedFilters(filters)

    const filteredData = getUserData?.data?.filter((user: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true // Skip empty filters
        return user[key]?.toString().toLowerCase() === value.toLowerCase()
      })
    })

    setTableData(filteredData) // Update table data with filtered results
    setAddMoreFilters(false) // Close the filter dialog
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

  // Dispatch API call whenever debouncedSearch changes
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
      dispatch(fetchUserbyId(params))
    }
  }, [selectedRow, dispatch])

  useEffect(() => {
    if (getUserData?.data) {
      setTableData(getUserData.data)
    }
  }, [getUserData])
  console.log(getUserData, 'getUserData')
  const columns: ColumnDef<any>[] = [
    // { accessorKey: 'EmployeeId', header: 'Employee ID' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'user_name', header: 'User Name' },
    { accessorKey: 'user_type', header: 'User Type' },
    { accessorKey: 'user_status', header: 'User Status' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'company', header: 'Company' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'branch', header: 'Branch' },
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
    user_code: 'User Code',
    user_status: 'User Status',
    user_type: 'User Type',
    title: 'Title',
    user_name: 'User Name',
    date_of_birth: 'Date of Birth',
    gender: 'Gender',
    company: 'Company',
    business_unit_or_function: 'Business Unit/Function',
    department: 'Department',
    territory: 'Territory',
    zone: 'Zone',
    region: 'Region',
    area: 'Area',
    cluster: 'Cluster',
    branch: 'Branch',
    branch_code: 'Branch Code',
    city_classification: 'City Classification',
    state: 'State',
    personal_email_address: 'Personal Email Address',
    office_email_address: 'Office Email Address',
    date_of_joining: 'Date of Joining',
    designation: 'Designation',
    user_category_type: 'User Category Type',
    permanent_address_line1: 'Permanent Address Line 1',
    permanent_city: 'Permanent City',
    permanent_state: 'Permanent State',
    permanent_country: 'Permanent Country',
    permanent_postal_code: 'Permanent Postal Code',
    permanent_mobile: 'Permanent Mobile',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  }

  return (
    <div>
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
      </div>

      <DynamicTable columns={columns} data={tableData} />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedRow ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}
            >
              {Object.entries(selectedRow)
                .filter(([key]) => key !== 'id')
                .map(([key, value]) => {
                  let formattedValue: string | null = null

                  if (
                    (key.includes('date') || key.toLowerCase().includes('at')) &&
                    (typeof value === 'string' || value instanceof Date)
                  ) {
                    formattedValue = formatDate(value)
                  } else {
                    formattedValue = value ? value.toString() : 'N/A'
                  }

                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{headerMapping[key] || key}</div>
                      <div>{formattedValue}</div>
                    </div>
                  )
                })}
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
