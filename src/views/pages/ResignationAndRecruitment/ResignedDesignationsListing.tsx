'use client'

import React, { useEffect, useState } from 'react'
import { Box, Card, IconButton, InputAdornment, Typography, Tooltip, Divider, Button } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import type { TextFieldProps } from '@mui/material/TextField'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import TableChartIcon from '@mui/icons-material/TableChart'

import CustomTextField from '@/@core/components/mui/TextField'
import { useRouter, useSearchParams } from 'next/navigation'
import XFactorDialog from '@/components/Dialog/x-factorDialog'
import DynamicButton from '@/components/Button/dynamicButton'
import RecruitmentLocationFilter from '@/@core/components/dialogs/recruitment-location-filters'

const ResignedDesignationsListing = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [paginationState, setPaginationState] = useState({ limit: 10, page: 1, display_numbers_count: 5 })
  const [XFactorDialogOpen, setXFactorDialogOpen] = useState(false)
  const [xFactorValue, setXFactorValue] = useState(5)
  const [locationFilterDialogOpen, setLocationFilterDialogOpen] = useState(false)
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

  const [selectedLocationFilters, setSelectedLocationFilters] = useState({
    territory: null,
    zone: null,
    region: null,
    area: null,
    cluster: null,
    branch: null
  })

  const handleLocationFliterChange = (field: string) => (option: { name: string } | null) => {
    setSelectedLocationFilters(prev => ({
      ...prev,
      [field]: option
    }))
    console.log(`${field} selected:`, option)
  }

  const options = {
    territory: [{ name: 'Territory 1' }, { name: 'Territory 2' }, { name: 'Territory 3' }],
    zone: [{ name: 'Zone A' }, { name: 'Zone B' }, { name: 'Zone C' }],
    region: [{ name: 'Region X' }, { name: 'Region Y' }, { name: 'Region Z' }],
    area: [{ name: 'Area 1' }, { name: 'Area 2' }, { name: 'Area 3' }],
    cluster: [{ name: 'Cluster Alpha' }, { name: 'Cluster Beta' }, { name: 'Cluster Gamma' }],
    branch: [{ name: 'Branch 101' }, { name: 'Branch 102' }, { name: 'Branch 103' }]
  }

  const employees = [
    {
      employeeCode: 'EMP001',
      employmentStatus: 'Approval Pending',
      employmentType: 'Full-time',
      title: 'Mr.',
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
      requestType: 'Resignation Request',
      additionalDetails: 'Working on cutting-edge AI projects.'
    },
    {
      employeeCode: 'EMP002',
      employmentStatus: 'Approval Pending',
      employmentType: 'Part-time',
      title: 'Ms.',
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
      additionalDetails: 'Pursuing further education.',
      requestType: 'Manual Request'
    },
    {
      employeeCode: 'EMP003',
      employmentStatus: 'Approved',
      employmentType: 'Full-time',
      title: 'Dr.',
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
      additionalDetails:
        'Additional information may include civic activities, awards and recognitions, volunteering, or cultural skills like language or travel. It may also include other interests or activities that may show leadership, character, or qualities you feel are beneficial to your career..',

      requestType: 'Bucket Expansion'
    },
    {
      employeeCode: 'EMP004',
      employmentStatus: 'Approved',
      employmentType: 'Part-time',
      title: 'Mr.',
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
      additionalDetails: 'Specializes in corporate budgeting and analysis.',
      requestType: 'Resignation Request'
    },
    {
      employeeCode: 'EMP005',
      employmentStatus: 'Rejected',
      employmentType: 'Full-time',
      title: 'Mrs.',
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
      mobileNumber: '+1-234-567-8901',
      dateOfResignation: '2024-10-15',
      lastWorkingDay: '2024-11-15',
      additionalDetails: 'Left to focus on family commitments.',
      requestType: 'Resignation Request'
    },
    {
      employeeCode: 'EMP006',
      employmentStatus: 'Approved',
      employmentType: 'Full-time',
      title: 'Mrs.',
      company: 'XYZ Ltd',
      department: 'IT',
      territory: 'South Zone',
      zone: 'Zone B',
      region: 'Region 2',
      area: 'Area 4',
      cluster: 'Cluster Y',
      branch: 'South Branch',
      branchCode: 'BR006',
      cityClassification: 'Urban',
      state: 'Florida',
      personalEmail: 'catherine.green@example.com',
      officeEmail: 'c.green@xyzltd.com',
      dateOfJoining: '2019-02-10',
      groupDOJ: '2019-02-10',
      designation: 'Software Engineer',
      employeeCategory: 'Technical',
      employeeType: 'Permanent',
      noticePeriod: '60 days',
      mobileNumber: '+1-456-789-1234',
      dateOfResignation: '2025-01-10',
      lastWorkingDay: '2025-03-11',
      additionalDetails:
        'Additional information may include civic activities, awards and recognitions, volunteering, or cultural skills like language or travel. It may also include other interests or activities that may show leadership, character, or qualities you feel are beneficial to your career..',
      requestType: 'Manual Request'
    },
    {
      employeeCode: 'EMP007',
      employmentStatus: 'Approval Pending',
      employmentType: 'Part-time',
      title: 'Mr.',
      company: 'LMN Tech',
      department: 'R&D',
      territory: 'East Zone',
      zone: 'Zone C',
      region: 'Region 3',
      area: 'Area 6',
      cluster: 'Cluster Z',
      branch: 'Tech Park',
      branchCode: 'BR007',
      cityClassification: 'Semi-Urban',
      state: 'New York',
      personalEmail: 'samuel.morris@example.com',
      officeEmail: 'sam.morris@lmntech.com',
      dateOfJoining: '2020-05-20',
      groupDOJ: '2020-05-20',
      designation: 'Software Engineer',
      employeeCategory: 'Technical',
      employeeType: 'Contract',
      noticePeriod: '15 days',
      mobileNumber: '+1-789-123-4567',
      dateOfResignation: '2024-12-25',
      lastWorkingDay: '2025-01-15',
      additionalDetails: 'Pursuing a startup venture.',
      requestType: 'Bucket Expansion'
    },
    {
      employeeCode: 'EMP008',
      employmentStatus: 'Approved',
      employmentType: 'Full-time',
      title: 'Dr.',
      company: 'EFG Solutions',
      department: 'Operations',
      territory: 'Central Zone',
      zone: 'Zone E',
      region: 'Region 5',
      area: 'Area 10',
      cluster: 'Cluster T',
      branch: 'Headquarters',
      branchCode: 'BR008',
      cityClassification: 'Metro',
      state: 'Texas',
      personalEmail: 'brian.davis@example.com',
      officeEmail: 'b.davis@efgsolutions.com',
      dateOfJoining: '2016-09-15',
      groupDOJ: '2016-09-15',
      designation: 'Software Engineer',
      employeeCategory: 'Technical',
      employeeType: 'Permanent',
      noticePeriod: '45 days',
      mobileNumber: '+1-234-890-5678',
      dateOfResignation: '2024-11-10',
      lastWorkingDay: '2025-01-10',
      additionalDetails: 'Leaving to focus on personal projects.',
      requestType: 'Resignation Request'
    },
    {
      employeeCode: 'EMP010',
      employmentStatus: 'Rejected',
      employmentType: 'Part-time',
      title: 'Ms.',
      company: 'RetailHub',
      department: 'Sales',
      territory: 'Central Zone',
      zone: 'Zone F',
      region: 'Region 6',
      area: 'Area 10',
      cluster: 'Cluster P',
      branch: 'Retail Office',
      branchCode: 'BR010',
      cityClassification: 'Semi-Urban',
      state: 'Georgia',
      personalEmail: 'carlacarter@example.com',
      officeEmail: 'carla.carter@retailhub.com',
      dateOfJoining: '2019-07-25',
      groupDOJ: '2019-07-25',
      designation: 'Sales Executive',
      employeeCategory: 'Sales',
      employeeType: 'Permanent',
      noticePeriod: '60 days',
      mobileNumber: '+1-321-654-9870',
      dateOfResignation: '2024-08-18',
      lastWorkingDay: '2024-09-18',
      additionalDetails: 'Relocating to another city.',
      requestType: 'Resignation Request'
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

      <RecruitmentLocationFilter
        open={locationFilterDialogOpen}
        setOpen={setLocationFilterDialogOpen}
        onApplyFilters={function (selectedFilters: Record<string, any>): void {
          throw new Error('Function not implemented.')
        }}
        options={options}
        handleLocationFliterChange={handleLocationFliterChange}
        selectedLocationFilters={selectedLocationFilters}
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
              label='Search'
              value={search}
              onChange={(value: any) => setSearch(value)}
              placeholder='Search by Department, Grade...'
              className='is-full sm:is-[400px]'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' sx={{ cursor: 'pointer' }}>
                    <i className='tabler-search text-xxl' />
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ mt: 5 }}>
              <DynamicButton
                label='Add Filters'
                variant='tonal'
                icon={<i className='tabler-plus' />}
                position='start'
                children='Add Filters'
                onClick={() => setLocationFilterDialogOpen(true)}
              />
            </Box>
          </div>

          <Box className='flex gap-4 justify-start' sx={{ alignItems: 'flex-start', mt: 4 }}>
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
              {/* Table View Button */}
              <Tooltip title='Table View'>
                <IconButton color={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
        {/* <Box>sample</Box> */}
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
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.15)'
                },
                marginBottom: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}
              key={index}
              onClick={() => router.push(`/recruitment-management/view/${employee.employeeCode}`)}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: 3
                }}
              >
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
                      sx={{ padding: '6px 16px', '&:hover': { backgroundColor: '#388e3c' } }}
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
                      sx={{ padding: '6px 16px', '&:hover': { backgroundColor: '#d32f2f' } }}
                      startIcon={<i className='tabler-playstation-x' />}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
              {/* Main content */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  padding: '8px 0',
                  flexGrow: 1
                }}
              >
                <Box>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Type:</strong> {employee.requestType}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Department:</strong> {employee.department}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Branch:</strong> {employee.branch}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Band</strong> B1
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Grade:</strong> G1
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#555', marginBottom: 1 }}>
                    <strong>Company:</strong> Muthoot Fincorp
                  </Typography>
                </Box>
              </Box>
              {/* Employment Status */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Status:</strong>&nbsp;
                  <span
                    style={{
                      color:
                        employee.employmentStatus === 'Approval Pending'
                          ? '#ff9800'
                          : employee.employmentStatus === 'Approved'
                            ? '#4caf50'
                            : employee.employmentStatus === 'Rejected'
                              ? '#f44336'
                              : '#757575'
                    }}
                  >
                    {employee.employmentStatus}
                  </span>
                </Typography>
              </Box>
              {/* Resignation Request Details */}
              {employee.requestType === 'Resignation Request' && (
                <Box
                  sx={{
                    backgroundColor: '#fafafa',
                    borderLeft: '4px solid #1976d2',
                    padding: '8px 8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Typography variant='body1' sx={{ color: '#333' }}>
                    <strong>Resigned Employee Code:</strong> {employee?.employeeCode}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ marginY: 2 }} />
              {/* Additional Details */}
              <Tooltip title={employee.additionalDetails} arrow>
                <Box
                  sx={{
                    marginTop: 'auto',
                    backgroundColor: '#f4f4f4',
                    borderRadius: 2,
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#777',
                      fontStyle: 'italic',
                      fontSize: '0.9rem',
                      maxWidth: '250px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Additional Details: {employee.additionalDetails || 'N/A'}
                  </Typography>
                </Box>
              </Tooltip>
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
