// src/views/pages/Dashboard/ApprovalDashboard/dashboard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card as MuiCard,
  CardContent,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TableViewIcon from '@mui/icons-material/TableView'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import BlockIcon from '@mui/icons-material/Block'
import DashboardCard from '@/components/cards/approvaldashboardCard'
import { RootState, AppDispatch } from '@/redux/store'
import {
  fetchApprovalData,
  setSearchFilter,
  setDepartmentFilter,
  setStatusFilter,
  resetFilters,
  clearError
} from '@/redux/approvalDashboard/approvaldashboardSlice'

// Dummy data to simulate a populated payroll_inputs array
const DUMMY_PAYROLL_INPUTS = [
  {
    payroll_input_id: '1',
    payroll_config: 'Deduction File 1',
    month: 'September',
    year: '2025',
    status: 'Pending',
    type: 'Deduction'
  },
  {
    payroll_input_id: '2',
    payroll_config: 'Incentive File 1',
    month: 'September',
    year: '2025',
    status: 'Approved',
    type: 'Incentive'
  },
  {
    payroll_input_id: '3',
    payroll_config: 'Bonus File 1',
    month: 'September',
    year: '2025',
    status: 'Pending',
    type: 'Bonus'
  },
  {
    payroll_input_id: '4',
    payroll_config: 'Deduction File 2',
    month: 'September',
    year: '2025',
    status: 'Rejected',
    type: 'Deduction'
  },
  {
    payroll_input_id: '5',
    payroll_config: 'Gift File 1',
    month: 'September',
    year: '2025',
    status: 'Approved',
    type: 'Gift'
  }
]

// Helper function to map type to department
const getDepartmentFromType = (type: string) => {
  const departmentMap: { [key: string]: string } = {
    Deduction: 'Finance',
    Incentive: 'HR',
    Gift: 'HR',
    Bonus: 'Finance'
  }
  return departmentMap[type] || 'General'
}

// Transform API data to match your existing card structure
const transformApiDataToCardFormat = (apiData: any) => {
  const dataToUse = apiData?.payroll_inputs?.length > 0 ? apiData.payroll_inputs : DUMMY_PAYROLL_INPUTS

  return dataToUse.map((item: any, index: number) => ({
    id: item.payroll_input_id || index + 1,
    fileName: item.payroll_config || 'Payroll Configuration',
    submitter: 'System Generated',
    department: getDepartmentFromType(item.type) || 'Finance',
    submissionDate: `${item.month} ${item.year}`,
    status: item.status || 'Pending',
    approvedCount: item.status === 'Approved' ? 1 : 0,
    pendingCount: item.status === 'Pending' ? 1 : 0,
    rejectedCount: item.status === 'Rejected' ? 1 : 0
  }))
}

function BasicTable({ data, loading }: { data: any[]; loading: boolean }) {
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={200}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={200}>
        <Typography variant='h6' color='textSecondary'>
          No approval data available
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='basic table'>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>File Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Submitter</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='left'>
              Submission Date
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <Typography component='span' variant='body2' noWrap>
                  {row.fileName}
                </Typography>
              </TableCell>
              <TableCell>{row.submitter}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell align='left'>
                <Typography variant='body2' noWrap>
                  {row.submissionDate}
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Box
                  sx={{
                    backgroundColor:
                      row.status === 'Rejected' ? '#FFEBEE' : row.status === 'Pending' ? '#FFF3E0' : '#E8F5E9',
                    color: row.status === 'Rejected' ? '#D32F2F' : row.status === 'Pending' ? '#F57C00' : '#2E7D32',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  {row.status}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function GridView({ data, loading }: { data: any[]; loading: boolean }) {
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={200}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={200}>
        <Typography variant='h6' color='textSecondary'>
          No approval data available
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {data.map(item => (
        <Grid item xs={12} sm={4} key={item.id}>
          <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant='h6' component='div'>
                {item.fileName}
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={2}>
                Submitted by: {item.submitter}
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={2}>
                Department: {item.department}
              </Typography>
              <Typography variant='body2' color='text.secondary' mb={2}>
                Date: {item.submissionDate}
              </Typography>

              <Grid container spacing={1} mb={2}>
                <Grid item xs={4}>
                  <Chip
                    icon={<CheckCircleOutlineIcon fontSize='small' />}
                    label={`Approved: ${item.approvedCount}`}
                    color='success'
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<PendingActionsIcon fontSize='small' />}
                    label={`Pending: ${item.pendingCount}`}
                    color='warning'
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<BlockIcon fontSize='small' />}
                    label={`Rejected: ${item.rejectedCount}`}
                    color='error'
                    variant='outlined'
                    size='small'
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  backgroundColor:
                    item.status === 'Rejected' ? '#FFEBEE' : item.status === 'Pending' ? '#FFF3E0' : '#E8F5E9',
                  color: item.status === 'Rejected' ? '#D32F2F' : item.status === 'Pending' ? '#F57C00' : '#2E7D32',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 500,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                {item.status}
              </Box>

              <Button
                fullWidth
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: '#0191DA',
                  '&:hover': { backgroundColor: '#0178B0' }
                }}
              >
                Review
              </Button>
            </CardContent>
          </MuiCard>
        </Grid>
      ))}
    </Grid>
  )
}

export function DataGridView() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error, filters } = useSelector((state: RootState) => state.approvalReducer)

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all')
  const [employeeCode] = useState('AP10000192')

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'table') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(event.target.value))
  }

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDepartmentFilter(event.target.value))
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStatusFilter(event.target.value))
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  // Transform API data to match your card structure
  const transformedData = transformApiDataToCardFormat(data)

  // Filter data based on current filters
  const filteredData = transformedData.filter(item => {
    const matchesSearch = filters.search ? item.fileName.toLowerCase().includes(filters.search.toLowerCase()) : true
    const matchesDepartment = filters.department !== 'All' ? item.department === filters.department : true
    const matchesStatus = filters.status !== 'All' ? item.status === filters.status : true

    // Filter based on active tab
    const matchesTab = (() => {
      switch (activeTab) {
        case 'pending':
          return item.status === 'Pending'
        case 'completed':
          return item.status === 'Approved'
        case 'rejected':
          return item.status === 'Rejected'
        case 'all':
        default:
          return true
      }
    })()

    return matchesSearch && matchesDepartment && matchesStatus && matchesTab
  })

  // Calculate dashboard card statistics from API data
  const calculateStats = () => {
    // Use the API data if it exists, otherwise use dummy data
    const payrollInputs = data?.payroll_inputs?.length > 0 ? data.payroll_inputs : DUMMY_PAYROLL_INPUTS

    const pendingCount = payrollInputs.filter((item: any) => item.status === 'Pending').length
    const approvedCount = payrollInputs.filter((item: any) => item.status === 'Approved').length
    const rejectedCount = payrollInputs.filter((item: any) => item.status === 'Rejected').length
    const totalCount = payrollInputs.length

    return [
      {
        title: 'Pending Reviews',
        value: pendingCount,
        description: 'Items awaiting your approval'
      },
      {
        title: 'Approved Last Week',
        value: approvedCount,
        description: 'Items you have approved'
      },
      {
        title: 'Rejected Last Week',
        value: rejectedCount,
        description: 'Items you have rejected'
      },
      {
        title: 'Total Processed',
        value: totalCount,
        description: 'Total items in queue'
      }
    ]
  }

  const cardData = calculateStats()

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchApprovalData(employeeCode))
  }, [dispatch, employeeCode])

  return (
    <Box sx={{ p: 4, backgroundColor: '#EFF1FF', minHeight: '100vh' }}>
      <Typography variant='h4' mb={4}>
        Approval Dashboard
      </Typography>

      {error && (
        <Alert severity='error' onClose={handleClearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 270px)',
            gap: 2,
            mb: 4,
            '@media (max-width: 1080px)': {
              gridTemplateColumns: 'repeat(2, 270px)'
            },
            '@media (max-width: 540px)': {
              gridTemplateColumns: '1fr'
            }
          }}
        >
          {cardData.map((card, index) => (
            <DashboardCard key={index} title={card.title} value={card.value} description={card.description} />
          ))}
        </Box>
      </Grid>

      <Box
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 1,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          mb: 3
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
          <Stack direction='row' spacing={2} alignItems='center'>
            <TextField
              variant='outlined'
              placeholder='Search by file name or submitter'
              size='small'
              sx={{ backgroundColor: 'white' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              value={filters.search}
              onChange={handleSearchChange}
            />
            <TextField
              select
              size='small'
              label='Department'
              value={filters.department}
              sx={{ backgroundColor: 'white', minWidth: 120 }}
              SelectProps={{ native: true }}
              onChange={handleDepartmentChange}
            >
              <option value='All'>All</option>
              <option value='Finance'>Finance</option>
              <option value='Marketing'>Marketing</option>
              <option value='HR'>HR</option>
              <option value='Engineering'>Engineering</option>
            </TextField>
            <TextField
              select
              size='small'
              label='Status'
              value={filters.status}
              sx={{ backgroundColor: 'white', minWidth: 120 }}
              SelectProps={{ native: true }}
              onChange={handleStatusChange}
            >
              <option value='All'>All</option>
              <option value='Pending'>Pending</option>
              <option value='Approved'>Approved</option>
              <option value='Rejected'>Rejected</option>
            </TextField>
            <Button variant='outlined' onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </Stack>

          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange} aria-label='view mode'>
            <ToggleButton value='grid' aria-label='grid view'>
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value='table' aria-label='table view'>
              <TableViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {viewMode === 'grid' ? (
        <GridView data={filteredData} loading={loading} />
      ) : (
        <Box sx={{ height: 640, width: '100%' }}>
          <BasicTable data={filteredData} loading={loading} />
        </Box>
      )}
    </Box>
  )
}

export default DataGridView
