'use client'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
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
  IconButton,
  Checkbox
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  ArrowUpward as ChevronUpIcon,
  ArrowDownward as ChevronDownIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'

interface Employee {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  designation: string
  status: 'approve' | 'reject'
  selected: boolean
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
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP987',
      firstName: 'SRADHA',
      middleName: '',
      lastName: 's',
      email: 'sradha@gmxsolutions.in',
      designation: 'Manager',
      status: 'approve',
      selected: false
    },
    {
      id: 'EMP018',
      firstName: 'NAJMA',
      middleName: '',
      lastName: 'A P',
      email: 'najma@gmxsolutions.in',
      designation: 'HR',
      status: 'reject',
      selected: false
    },
    {
      id: 'EMP611',
      firstName: 'ASWANY',
      middleName: '',
      lastName: 'K',
      email: 'aswany@gmxsolutions.in',
      designation: 'Financial Analyst',
      status: 'approve',
      selected: false
    },
    {
      id: 'EMP112',
      firstName: 'MEGHA',
      middleName: '',
      lastName: 'C J',
      email: 'megha@gmxsolutions.in',
      designation: 'Manager',
      status: 'approve',
      selected: false
    },
    {
      id: 'EMP789',
      firstName: 'SHARUN',
      middleName: '',
      lastName: 'T M',
      email: 'sharun@gmxsolutions.in',
      designation: 'System Admin',
      status: 'approve',
      selected: false
    },
    {
      id: 'EMP003',
      firstName: 'SABEERA',
      middleName: '',
      lastName: 'S',
      email: 'sabeera@gmxsolutions.in',
      designation: 'Manager',
      status: 'reject',
      selected: false
    }
  ])

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

  const handleStatusChange = (employeeId: string, newStatus: 'approve' | 'reject') => {
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => (employee.id === employeeId ? { ...employee, status: newStatus } : employee))
    )
    console.log(`Changing status for employee ${employeeId} to ${newStatus}`)
  }

  const handleViewPayroll = (employeeId: string) => {
    // In a real app, this would open the payroll file
    console.log(`Viewing payroll for employee ${employeeId}`)
    alert(`View payroll file for employee ${employeeId}`)
  }

  const handleSelectEmployee = (employeeId: string) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(employee =>
        employee.id === employeeId ? { ...employee, selected: !employee.selected } : employee
      )
    )
  }

  const handleSelectAll = () => {
    const allSelected = employees.every(employee => employee.selected)
    setEmployees(prevEmployees => prevEmployees.map(employee => ({ ...employee, selected: !allSelected })))
  }

  const handleBulkReject = () => {
    const selectedEmployees = employees.filter(employee => employee.selected)
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee to reject')
      return
    }

    setEmployees(prevEmployees =>
      prevEmployees.map(employee => (employee.selected ? { ...employee, status: 'reject' } : employee))
    )
    alert(`Rejected ${selectedEmployees.length} employee(s)`)
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
                Month
              </Typography>
              <Typography variant='body1'>{branchDetails.branchName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Year
              </Typography>
              <Typography variant='body1'>{branchDetails.branchCode}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Amount
              </Typography>
              <Typography variant='body1'>{branchDetails.territory}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Status
              </Typography>
              <Typography variant='body1'>{branchDetails.zone}</Typography>
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
                  <MenuItem value='approve'>Approve</MenuItem>
                  <MenuItem value='reject'>Reject</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant='outlined'
                color='error'
                onClick={handleBulkReject}
                disabled={!employees.some(employee => employee.selected)}
              >
                Reject Selected
              </Button>
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
                  <TableCell padding='checkbox'>
                    <Checkbox
                      indeterminate={
                        employees.some(employee => employee.selected) && !employees.every(employee => employee.selected)
                      }
                      checked={employees.every(employee => employee.selected)}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
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
                  <TableCell>Payroll File</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <TableRow key={employee.id} selected={employee.selected}>
                      <TableCell padding='checkbox'>
                        <Checkbox checked={employee.selected} onChange={() => handleSelectEmployee(employee.id)} />
                      </TableCell>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.firstName}</TableCell>
                      <TableCell>{employee.middleName}</TableCell>
                      <TableCell>{employee.lastName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>
                        <IconButton
                          color='primary'
                          onClick={() => handleViewPayroll(employee.id)}
                          title='View Payroll File'
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant={employee.status === 'approve' ? 'contained' : 'outlined'}
                            size='small'
                            color='success'
                            onClick={() => handleStatusChange(employee.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant={employee.status === 'reject' ? 'contained' : 'outlined'}
                            size='small'
                            color='error'
                            onClick={() => handleStatusChange(employee.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align='center' sx={{ height: 120 }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ApprovalDashboard
