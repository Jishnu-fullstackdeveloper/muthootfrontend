'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Typography,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Divider,
  Button
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import type { TextFieldProps } from '@mui/material/TextField'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import CustomTextField from '@/@core/components/mui/TextField'
import { useRouter, useSearchParams } from 'next/navigation'
import XFactorDialog from '@/components/Dialog/x-factorDialog'
import SettingsIcon from '@mui/icons-material/Settings'
import AssessmentIcon from '@mui/icons-material/Assessment'

const ResignedDesignationsListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ limit: 10, page: 1, display_numbers_count: 5 })
  const [XFactorDialogOpen, setXFactorDialogOpen] = useState(false)
  const [xFactorValue, setXFactorValue] = useState(5)
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParams = searchParams.get('filter')

  const handleXFactorDialogOpen = () => {
    setXFactorDialogOpen(true)
  }

  const handleXFactorDialogClose = () => {
    setXFactorDialogOpen(false)
  }

  const handleSaveXFactor = (newXFactor: number) => {
    setXFactorValue(newXFactor)
  }

  const employees = [
    {
      employeeCode: 'EMP001',
      employmentStatus: 'Approval Pending',
      employmentType: 'Full-time',
      title: 'Mr.',
      employeeName: 'John Doe',
      company: 'ABC Corp',
      department: 'IT',
      territory: 'North Zone',
      zone: 'Zone A',
      region: 'Region 1',
      area: 'Area 5',
      cluster: 'Cluster X',
      branch: 'Main Branch',
      branchCode: 'BR001',
      cityClassification: 'Metro',
      state: 'California',
      personalEmail: 'johndoe@example.com',
      officeEmail: 'johnd@abccorp.com',
      dateOfJoining: '2015-06-15',
      groupDOJ: '2015-06-15',
      designation: 'Software Engineer',
      employeeCategory: 'Technical',
      employeeType: 'Permanent',
      noticePeriod: '30 days',
      mobileNumber: '+1-234-567-8901',
      dateOfResignation: '2024-12-01',
      lastWorkingDay: '2025-01-01',
      additionalDetails: 'Relocating to another city for personal reasons.'
    },
    {
      employeeCode: 'EMP002',
      employmentStatus: 'Approval Pending',
      employmentType: 'Part-time',
      title: 'Ms.',
      employeeName: 'Jane Smith',
      company: 'XYZ Ltd',
      department: 'HR',
      territory: 'South Zone',
      zone: 'Zone B',
      region: 'Region 2',
      area: 'Area 3',
      cluster: 'Cluster Y',
      branch: 'City Branch',
      branchCode: 'BR002',
      cityClassification: 'Urban',
      state: 'Texas',
      personalEmail: 'janesmith@example.com',
      officeEmail: 'jane.smith@xyzltd.com',
      dateOfJoining: '2018-03-12',
      groupDOJ: '2018-03-12',
      designation: 'HR Manager',
      employeeCategory: 'Administrative',
      employeeType: 'Contract',
      noticePeriod: '15 days',
      mobileNumber: '+1-345-678-9012',
      dateOfResignation: '2024-11-20',
      lastWorkingDay: '2024-12-05',
      additionalDetails: 'Pursuing further education.'
    },
    {
      employeeCode: 'EMP003',
      employmentStatus: 'Approved',
      employmentType: 'Full-time',
      title: 'Dr.',
      employeeName: 'Alice Brown',
      company: 'LMN Tech',
      department: 'R&D',
      territory: 'East Zone',
      zone: 'Zone C',
      region: 'Region 3',
      area: 'Area 7',
      cluster: 'Cluster Z',
      branch: 'Innovation Center',
      branchCode: 'BR003',
      cityClassification: 'Urban',
      state: 'Texas',
      personalEmail: 'janesmith@example.com',
      officeEmail: 'jane.smith@xyzltd.com',
      dateOfJoining: '2018-03-12',
      groupDOJ: '2018-03-12',
      designation: 'HR Manager',
      employeeCategory: 'Administrative',
      employeeType: 'Contract',
      noticePeriod: '15 days',
      mobileNumber: '+1-345-678-9012',
      dateOfResignation: '2024-11-20',
      lastWorkingDay: '2024-12-05',
      additionalDetails: 'Working on cutting-edge AI projects.'
    },
    {
      employeeCode: 'EMP004',
      employmentStatus: 'Approved',
      employmentType: 'Part-time',
      title: 'Mr.',
      employeeName: 'Michael Lee',
      company: 'PQR Inc',
      department: 'Finance',
      territory: 'West Zone',
      zone: 'Zone D',
      region: 'Region 4',
      area: 'Area 2',
      cluster: 'Cluster Q',
      branch: 'Corporate Office',
      branchCode: 'BR004',
      cityClassification: 'Metro',
      state: 'Texas',
      personalEmail: 'janesmith@example.com',
      officeEmail: 'jane.smith@xyzltd.com',
      dateOfJoining: '2018-03-12',
      groupDOJ: '2018-03-12',
      designation: 'HR Manager',
      employeeCategory: 'Administrative',
      employeeType: 'Contract',
      noticePeriod: '15 days',
      mobileNumber: '+1-345-678-9012',
      dateOfResignation: '2024-11-20',
      lastWorkingDay: '2024-12-05',
      additionalDetails: 'Specializes in corporate budgeting and analysis.'
    },
    {
      employeeCode: 'EMP005',
      employmentStatus: 'Rejected',
      employmentType: 'Full-time',
      title: 'Mrs.',
      employeeName: 'Emily Clark',
      company: 'EFG Solutions',
      department: 'Operations',
      territory: 'Central Zone',
      zone: 'Zone E',
      region: 'Region 5',
      area: 'Area 9',
      cluster: 'Cluster T',
      branch: 'Operations HQ',
      branchCode: 'BR005',
      cityClassification: 'Semi-Urban',
      state: 'Illinois',
      personalEmail: 'emilyclark@example.com',
      officeEmail: 'emily.clark@efgsolutions.com',
      dateOfJoining: '2017-03-05',
      groupDOJ: '2017-03-05',
      designation: 'Operations Manager',
      employeeCategory: 'Technical',
      employeeType: 'Permanent',
      noticePeriod: '30 days',
      dateOfResignation: '2024-10-15',
      lastWorkingDay: '2024-11-15',
      additionalDetails: 'Left to focus on family commitments.'
    },
    {
      employeeCode: 'EMP004',
      employmentStatus: 'Approved',
      employmentType: 'Part-time',
      title: 'Mr.',
      employeeName: 'Michael Lee',
      company: 'PQR Inc',
      department: 'Finance',
      territory: 'West Zone',
      zone: 'Zone D',
      region: 'Region 4',
      area: 'Area 2',
      cluster: 'Cluster Q',
      branch: 'Corporate Office',
      branchCode: 'BR004',
      cityClassification: 'Metro',
      state: 'Texas',
      personalEmail: 'janesmith@example.com',
      officeEmail: 'jane.smith@xyzltd.com',
      dateOfJoining: '2018-03-12',
      groupDOJ: '2018-03-12',
      designation: 'HR Manager',
      employeeCategory: 'Administrative',
      employeeType: 'Contract',
      noticePeriod: '15 days',
      mobileNumber: '+1-345-678-9012',
      dateOfResignation: '2024-11-20',
      lastWorkingDay: '2024-12-05',
      additionalDetails: 'Specializes in corporate budgeting and analysis.'
    }
  ]

  const handlePageChange = (event: any, value: any) => {
    setPaginationState(prev => ({ ...prev, page: value }))
  }

  const handleChangeLimit = (value: any) => {
    setPaginationState(prev => ({ ...prev, limit: value }))
  }

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  return (
    <div className='min-h-screen'>
      <XFactorDialog
        open={XFactorDialogOpen}
        onClose={handleXFactorDialogClose}
        onSave={handleSaveXFactor}
        currentXFactor={xFactorValue}
      />
      <Card
        sx={{
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backgroundColor: 'white',
          paddingBottom: 2
        }}
      >
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 'bold',
              color: '#333',
              letterSpacing: 1
            }}
          >
            Recruitment Requests
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Typography variant='body2' color='textSecondary'>
              Last Bot Update on: <span style={{ fontWeight: 'bold', color: '#2d2c2c' }}>January 6, 2025</span>
            </Typography>

            <Tooltip title='Click here for help'>
              <IconButton size='small'>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-start p-6 border-bs gap-4 custom-scrollbar-xaxis'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4 flex-wrap'>
            <DebouncedInput
              label='Search Designation'
              value={search}
              onChange={(value: any) => setSearch(value)}
              placeholder='Search by Designation...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
            <Box mt={1}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AssessmentIcon />}
                onClick={() => router.push('/recruitment-management/resignation-report')}
              >
                Reports Dashboard
              </Button>
            </Box>
            <Box mt={1}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<SettingsIcon />}
                onClick={handleXFactorDialogOpen}
              >
                Set X-Factor
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Tooltip title='Grid View'>
                <IconButton color={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='List View'>
                <IconButton color={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      </Card>

      <Box
        className={`${
          viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' : 'space-y-4'
        }`}
      >
        {employees
          ?.filter((d: any) => d.designation === filterParams?.replace(/-/g, ' '))
          ?.map((employee: any, index: number) => (
            <Box
              sx={{
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                padding: 3,
                borderRadius: 2,
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                border: '1px solid',
                borderColor: '#e0e0e0',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 12px 25px rgba(0, 0, 0, 0.15)'
                },
                marginBottom: 4
              }}
              key={index}
              onClick={() => router.push(`/recruitment-management/view/${employee.employeeCode}`)}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 3
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '1.2rem'
                  }}
                >
                  {/* {employee.title} {employee.employeeName} */}
                  {employee.designation}
                </Typography>

                {/* <Chip
                label={employee.employmentStatus}
                color={
                  employee.employmentStatus === 'Approval Pending'
                    ? 'warning'
                    : employee.employmentStatus === 'Approved'
                      ? 'success'
                      : employee.employmentStatus === 'Rejected'
                        ? 'error'
                        : 'default'
                }
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  padding: '0 8px',
                  borderRadius: 2
                }}
              /> */}

                {/* Approve and Reject Buttons */}
                {employee.employmentStatus === 'Approval Pending' && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                      marginTop: 2
                    }}
                  >
                    <Button
                      variant='contained'
                      color='success'
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      sx={{ padding: '6px 16px' }}
                      startIcon={<i className='tabler-check' />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      sx={{ padding: '6px 16px' }}
                      startIcon={<i className='tabler-playstation-x' />}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)', // Two columns
                  gap: 2,
                  padding: '8px 0'
                }}
              >
                <Box>
                  {/* <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                  <strong>Designation:</strong> {employee.designation}
                </Typography> */}
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Department:</strong> {employee.department}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Branch:</strong> {employee.branch}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Band </strong> B1
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Grade:</strong> G1
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Company:</strong> Muthoot Fincorp
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Status:</strong>&nbsp;
                  <span
                    style={{
                      color:
                        employee.employmentStatus === 'Approval Pending'
                          ? '#ff9800' // Orange for Pending
                          : employee.employmentStatus === 'Approved'
                            ? '#4caf50' // Green for Approved
                            : employee.employmentStatus === 'Rejected'
                              ? '#f44336' // Red for Rejected
                              : '#757575' // Default grey
                    }}
                  >
                    {employee.employmentStatus}
                  </span>
                </Typography>
              </Box>
              <Divider sx={{ marginY: 2 }} /> {/* Divider to separate the sections */}
              <Box sx={{ marginTop: 2, backgroundColor: '#f4f4f4', borderRadius: 2, padding: 2 }}>
                <Typography variant='body2' sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Additional Details: {employee.additionalDetails || 'N/A'}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>

      {/* <div className='flex items-center justify-end mt-6'>
        <FormControl size='small' sx={{ minWidth: 70 }}>
          <InputLabel>Count</InputLabel>
          <Select
            value={paginationState?.limit}
            onChange={e => handleChangeLimit(e.target.value)}
            label='Limit per page'
          >
            {[10, 25, 50, 100].map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
          count={paginationState?.display_numbers_count}
          page={paginationState?.page}
          onChange={handlePageChange}
        />
      </div> */}
    </div>
  )
}

export default ResignedDesignationsListing
