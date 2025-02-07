'use client'
import React, { useEffect, useState } from 'react'
import DynamicTable, { Person } from '@/components/Table/dynamicTable'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  Box,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MenuIcon from '@mui/icons-material/Menu'
import { fetchUser, fetchUserbyId } from '@/redux/userManagementSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ColumnDef } from '@tanstack/react-table'
import DynamicTextField from '@/components/TextField/dynamicTextField'
import DynamicButton from '@/components/Button/dynamicButton'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { debounce } from 'lodash'
import DynamicTooltip from '@/components/Tooltip/dynamicTooltip'
import CustomFilters from './FilterDialog'
import UserDetailsDialog from './ViewUser'

function UserListing() {
  const dispatch = useAppDispatch()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  // const [tableData, setTableData] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [addMoreFilters, setAddMoreFilters] = useState(false)
  const { getUserData }: any = useAppSelector((state: any) => state.userManagementReducer)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [openColumnDialog, setOpenColumnDialog] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    title: true,
    user_name: true,
    user_code: true,
    branch: true,
    branch_code: true
  })
  const [lockedColumns] = useState<Record<string, boolean>>({
    title: true,
    user_name: true,
    user_code: true,
    branch: true,
    branch_code: true
  })

  const formatDate = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleDateString('en-US')
  }
  const handleApplyFilters = (filters: Record<string, any>) => {
    setSelectedFilters(filters)

    const filteredData = getUserData?.data?.filter((user: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        return user[key]?.toString().toLowerCase() === value.toLowerCase()
      })
    })

    setTableData(filteredData)
    setAddMoreFilters(false)
  }

  const [tableData, setTableData] = useState<any[]>([
    {
      id: 1,
      title: 'Mr.',
      user_name: 'John Doe',
      user_code: 'JD001',
      branch: 'New York',
      branch_code: 'NY001',
      user_status: 'Active',
      user_type: 'Admin',
      date_of_birth: '1985-06-15',
      gender: 'Male',
      company: 'TechCorp',
      business_unit_or_function: 'IT',
      department: 'Development',
      territory: 'North America',
      zone: 'East',
      region: 'Northeast',
      area: 'Area 1',
      cluster: 'Cluster A',
      city_classification: 'Metro',
      state: 'New York',
      personal_email_address: 'john.doe@example.com',
      office_email_address: 'john.doe@techcorp.com',
      date_of_joining: '2015-03-01',
      designation: 'Software Engineer',
      user_category_type: 'Full-time',
      permanent_address_line1: '123 Main St',
      permanent_city: 'New York',
      permanent_state: 'NY',
      permanent_country: 'USA',
      permanent_postal_code: '10001',
      permanent_mobile: '1234567890',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-15'
    },
    {
      id: 2,
      title: 'Ms.',
      user_name: 'Jane Smith',
      user_code: 'JS002',
      branch: 'Los Angeles',
      branch_code: 'LA002',
      user_status: 'Inactive',
      user_type: 'User',
      date_of_birth: '1990-11-22',
      gender: 'Female',
      company: 'FinTech',
      business_unit_or_function: 'Finance',
      department: 'Accounts',
      territory: 'North America',
      zone: 'West',
      region: 'Pacific',
      area: 'Area 2',
      cluster: 'Cluster B',
      city_classification: 'Metro',
      state: 'California',
      personal_email_address: 'jane.smith@example.com',
      office_email_address: 'jane.smith@fintech.com',
      date_of_joining: '2018-07-10',
      designation: 'Accountant',
      user_category_type: 'Part-time',
      permanent_address_line1: '456 Elm St',
      permanent_city: 'Los Angeles',
      permanent_state: 'CA',
      permanent_country: 'USA',
      permanent_postal_code: '90001',
      permanent_mobile: '9876543210',
      createdAt: '2023-02-01',
      updatedAt: '2023-02-20'
    }
  ])

  const handleView = (row: Person) => {
    setSelectedRow(row)
    setOpenDialog(true)
  }

  const handleColumnSelect = (column: string) => {
    if (!lockedColumns[column]) {
      setSelectedColumns(prevState => ({
        ...prevState,
        [column]: !prevState[column]
      }))
    }
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
      dispatch(fetchUserbyId(params))
    }
  }, [selectedRow, dispatch])

  const tooltipTitle = 'Remove item'

  useEffect(() => {
    if (getUserData?.data) {
      setTableData(getUserData.data)
    }
  }, [getUserData])

  const headerMapping: Record<string, string> = {
    title: 'Title',
    user_code: 'User Code',
    user_name: 'User Name',
    branch: 'Branch',
    branch_code: 'Branch Code',
    user_status: 'User Status',
    user_type: 'User Type',
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
    city_classification: 'City Classification',
    state: 'State',
    personal_email_address: 'Personal Email Address',
    office_email_address: 'Office Email Address',
    date_of_joining: 'Date of Joining',
    designation: 'Designation',
    user_category_type: 'User Category Type',
    permanent_address_line1: ' Address Line 1',
    permanent_city: ' City',
    permanent_state: ' State',
    permanent_country: ' Country',
    permanent_postal_code: ' Postal Code',
    permanent_mobile: ' Mobile',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  }

  const columns: ColumnDef<any>[] = [
    ...Object.entries(selectedColumns)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => ({
        accessorKey: key,
        header: headerMapping[key] || key
      })),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DynamicButton onClick={() => handleView(row.original)} aria-label='View'>
          <VisibilityIcon className='w-5 h-5 text-gray-500' />
        </DynamicButton>
      )
    }
  ]

  const handleViewColumnClick = () => {
    setOpenColumnDialog(true)
  }

  return (
    <div>
      <div className='flex items-center justify-between bg-white p-4 my-4 rounded-xl'>
        <div className='flex items-center gap-4'>
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
          />
        </div>
        <DynamicTooltip title='Click to view columns'>
          <ViewColumnIcon
            aria-label='dense menu'
            sx={{
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
            onClick={handleViewColumnClick}
          >
            <MenuIcon />
          </ViewColumnIcon>
        </DynamicTooltip>
      </div>

      <div style={{ position: 'relative' }}>
        <DynamicTable columns={columns} data={tableData} />
      </div>

      <UserDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedRow={selectedRow}
        headerMapping={headerMapping}
        formatDate={formatDate}
      />

      <Dialog open={openColumnDialog} onClose={() => setOpenColumnDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          <Box>
            <Grid container spacing={2}>
              {Object.keys(headerMapping).map((columnKey, index) => (
                <Grid item xs={4} key={columnKey}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedColumns[columnKey] || false}
                        onChange={() => handleColumnSelect(columnKey)}
                        disabled={lockedColumns[columnKey]}
                      />
                    }
                    label={headerMapping[columnKey] || columnKey}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <DynamicButton onClick={() => setOpenColumnDialog(false)} color='primary'>
            Close
          </DynamicButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserListing
