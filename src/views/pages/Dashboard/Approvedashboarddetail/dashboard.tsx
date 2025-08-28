'use client'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  ArrowUpward as ChevronUpIcon,
  ArrowDownward as ChevronDownIcon
} from '@mui/icons-material'

interface Employee {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  designation: string
  status: string
}

interface BranchDetails {
  branchName: string
  branchCode: string
  territory: string
  zone: string
  region: string
  area: string
  cluster: string
  cityClassification: string
  state: string
}

interface SortIconProps {
  field: keyof Employee
}

const ApprovalDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortField, setSortField] = useState<keyof Employee>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Mock data for demonstration
  const branchDetails: BranchDetails = {
    branchName: 'KUNNIKODE',
    branchCode: 'F076-B',
    territory: 'TERRITORY-1',
    zone: 'KERALA SOUTH',
    region: 'KOLLAM',
    area: 'KOTTARAKKARA',
    cluster: 'KOTTARAKKARA',
    cityClassification: 'THRISSUR',
    state: 'KERALA'
  }

  const employees: Employee[] = [
    {
      id: 'EMP987',
      firstName: 'SRADHA',
      middleName: 's',
      lastName: '',
      email: 'sradha@gmxsolutions.in',
      designation: 'Manager',
      status: 'Active'
    },
    {
      id: 'EMP018',
      firstName: 'NAJMA',
      middleName: 'A P',
      lastName: '',
      email: 'najma@gmxsolutions.in',
      designation: 'HR',
      status: 'Active'
    },
    {
      id: 'EMP611',
      firstName: 'ASWANY',
      middleName: 'K',
      lastName: '',
      email: 'aswany@gmxsolutions.in',
      designation: 'Financial Analyst',
      status: 'Active'
    },
    {
      id: 'EMP112',
      firstName: 'MEGHA',
      middleName: 'C J',
      lastName: '',
      email: 'megha@gmxsolutions.in',
      designation: 'Manager',
      status: 'Active'
    },
    {
      id: 'EMP789',
      firstName: 'SHARUN',
      middleName: 'T M',
      lastName: '',
      email: 'sharun@gmxsolutions.in',
      designation: 'System Admin',
      status: 'Active'
    },
    {
      id: 'EMP003',
      firstName: 'SABEERA',
      middleName: 's',
      lastName: '',
      email: 'sabeera@gmxsolutions.in',
      designation: 'Manager',
      status: 'Resigned'
    }
  ]

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(
      employee =>
        (employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedStatus === 'all' || employee.status === selectedStatus)
    )
    .sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExport = () => {
    // In a real app, this would export data
    console.log('Exporting data...')
    alert('Export functionality would be implemented here')
  }

  const SortIcon: React.FC<SortIconProps> = ({ field }) => {
    if (sortField !== field) return <ChevronDownIcon sx={{ opacity: 0.3, fontSize: 16 }} />
    return sortDirection === 'asc' ? <ChevronUpIcon sx={{ fontSize: 16 }} /> : <ChevronDownIcon sx={{ fontSize: 16 }} />
  }

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant='h4' component='h1' fontWeight='bold'>
          Approval Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='outlined' onClick={handleExport} startIcon={<DownloadIcon />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Branch Selection */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title='Select Branch' />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField placeholder='Search branches...' size='small' sx={{ maxWidth: 400 }} />
            <Button variant='contained' startIcon={<SearchIcon />}>
              Search
            </Button>
            <Button variant='outlined' startIcon={<FilterIcon />}>
              Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Branch Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title='Branch Details' />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Branch Name
              </Typography>
              <Typography variant='body1'>{branchDetails.branchName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Branch Code
              </Typography>
              <Typography variant='body1'>{branchDetails.branchCode}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Territory
              </Typography>
              <Typography variant='body1'>{branchDetails.territory}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Zone
              </Typography>
              <Typography variant='body1'>{branchDetails.zone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Region
              </Typography>
              <Typography variant='body1'>{branchDetails.region}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Area
              </Typography>
              <Typography variant='body1'>{branchDetails.area}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Cluster
              </Typography>
              <Typography variant='body1'>{branchDetails.cluster}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                City Classification
              </Typography>
              <Typography variant='body1'>{branchDetails.cityClassification}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                State
              </Typography>
              <Typography variant='body1'>{branchDetails.state}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employee Details */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title='Employee Details'
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder='Search employees...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                size='small'
                sx={{ maxWidth: 400 }}
              />
              <FormControl size='small' sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select value={selectedStatus} label='Status' onChange={e => setSelectedStatus(e.target.value)}>
                  <MenuItem value='all'>All Status</MenuItem>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Resigned'>Resigned</MenuItem>
                </Select>
              </FormControl>
            </Box>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort('id')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      ID
                      <SortIcon field='id' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('firstName')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      First Name
                      <SortIcon field='firstName' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('middleName')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Middle Name
                      <SortIcon field='middleName' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('lastName')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Last Name
                      <SortIcon field='lastName' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('email')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Email
                      <SortIcon field='email' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('designation')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Designation
                      <SortIcon field='designation' />
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('status')}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Status
                      <SortIcon field='status' />
                    </Box>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.firstName}</TableCell>
                      <TableCell>{employee.middleName}</TableCell>
                      <TableCell>{employee.lastName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.status}
                          color={employee.status === 'Active' ? 'success' : 'error'}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant='outlined' size='small'>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align='center' sx={{ height: 120 }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Budget and Vacancy Management */}
      {/* <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title='Budget Management' />
            <CardContent> */}
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Total Budget
                  </Typography>
                  <Typography variant='body1' fontWeight='bold'>
                    ₹2,45,000
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Allocated
                  </Typography>
                  <Typography variant='body1' color='success.main'>
                    ₹1,87,500
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Remaining
                  </Typography>
                  <Typography variant='body1' color='info.main'>
                    ₹57,500
                  </Typography>
                </Box>
                <LinearProgress variant='determinate' value={76} sx={{ height: 10, borderRadius: 5 }} color='success' />
              </Box> */}
      {/* </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}> */}
      {/* <Card>
            <CardHeader title='Vacancy Management' />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant='body2' fontWeight='medium' component='span'>
                    Bucket Name:{' '}
                  </Typography>
                  <Typography variant='body1' component='span'>
                    Q3 2024 Recruitment
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Total Positions
                  </Typography>
                  <Typography variant='body1' fontWeight='bold'>
                    12
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Filled
                  </Typography>
                  <Typography variant='body1' color='success.main'>
                    8
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight='medium'>
                    Vacant
                  </Typography>
                  <Typography variant='body1' color='error.main'>
                    4
                  </Typography>
                </Box>
                <LinearProgress variant='determinate' value={66} sx={{ height: 10, borderRadius: 5 }} color='success' />
              </Box>
            </CardContent>
          </Card> */}
      {/* </Grid> */}
      {/* </Grid> */}
    </Container>
  )
}

export default ApprovalDashboard
