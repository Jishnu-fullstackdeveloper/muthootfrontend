'use client'

import React from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DashboardCard from '@/components/cards/adminconfigurationCard'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
// -- Dashboard Card Data --
// -- Dashboard Card Data --
const cardData = [
  {
    title: 'Active Templates',
    value: 2,
    description: 'Currently Operational Templates'
  },
  {
    title: 'Deactivated Templates',
    value: 2,
    description: 'Archive or Inactive Templates'
  },
  {
    title: 'Pending Reviews',
    value: 2,
    description: 'Templates Awaiting Admin Approvals'
  },
  {
    title: 'New Templates Added',
    value: 5,
    description: 'Added This Month'
  }
]
// -- Table Configuration --
const columns = [
  { field: 'inputName', headerName: 'Input Name' },
  { field: 'type', headerName: 'Type' },
  { field: 'departments', headerName: 'Departments' },
  { field: 'makers', headerName: 'Makers' },
  { field: 'checkers', headerName: 'Checkers' },
  { field: 'status', headerName: 'Status' },
  { field: 'actions', headerName: 'Actions' }
]

const rows = [
  {
    id: 1,
    inputName: 'Quarterly Bonus Q1',
    type: 'Incentive',
    departments: 'Sales, Marketing',
    makers: 'Alice Johnson, Bob Williams',
    checkers: 'Charlie Brown',
    status: 'Active'
  },
  {
    id: 2,
    inputName: 'Monthly Deduction Absences',
    type: 'Deduction',
    departments: 'HR, Finance',
    makers: 'Diana Miller',
    checkers: 'Eve Davis',
    status: 'Active'
  },
  {
    id: 3,
    inputName: 'Annual Performance Bonus',
    type: 'Incentive',
    departments: 'All Departments',
    makers: 'Frank Green, Grace Hall',
    checkers: 'Heidi King',
    status: 'Active'
  },
  {
    id: 4,
    inputName: 'Project Completion Bonus',
    type: 'Incentive',
    departments: 'Engineering',
    makers: 'Ivan White',
    checkers: 'Judy Black',
    status: 'Active'
  },
  {
    id: 5,
    inputName: 'Late Submission Penalty',
    type: 'Deduction',
    departments: 'Finance, Legal',
    makers: 'Karen Lee',
    checkers: 'Liam Wong',
    status: 'Active'
  }
]

// -- Table Component --
function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.field}
                sx={{
                  backgroundColor: '#f8f9fa',
                  padding: 2,
                  fontWeight: 600,
                  color: '#333',
                  borderBottom: '1px solid #eee'
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.inputName}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.departments}</TableCell>
              <TableCell>{row.makers}</TableCell>
              <TableCell>{row.checkers}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    backgroundColor: '#E0F7FA',
                    color: '#00796B',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  {row.status}
                </Box>
              </TableCell>
              <TableCell>
                <Stack direction='row' spacing={1}>
                  <EditIcon
                    sx={{
                      color: '#0191DA',
                      cursor: 'pointer',
                      fontSize: '18px',
                      '&:hover': { color: '#0177b8' }
                    }}
                  />
                  <PowerSettingsNewIcon
                    sx={{
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '18px',
                      '&:hover': { color: '#d32f2f' }
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// -- Main Page Component --
export default function DataGridView() {
  const [activeTab, setActiveTab] = React.useState('active')

  return (
    <Box sx={{ backgroundColor: '#EFF1FF', minHeight: '100vh', p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h5' fontWeight={600}>
          Admin Configuration
        </Typography>
        <Button
          variant='contained'
          sx={{
            backgroundColor: '#0191DA',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#0177b8' }
          }}
        >
          Add New Template
        </Button>
      </Box>

      {/* Overview */}
      <Typography variant='subtitle1' sx={{ fontWeight: 500, color: '#666', mb: 2 }}>
        Overview of Configuration
      </Typography>

      {/* Cards */}
      {/* Cards */}
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
      {/* Tabs */}
      <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={activeTab === 'active' ? 'contained' : 'outlined'}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: activeTab === 'active' ? '#0191DA' : 'white',
            color: activeTab === 'active' ? 'white' : '#666',
            borderColor: activeTab === 'active' ? '#0191DA' : '#ddd'
          }}
          onClick={() => setActiveTab('active')}
        >
          Active Templates (5)
        </Button>
        <Button
          variant={activeTab === 'deactivated' ? 'contained' : 'outlined'}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: activeTab === 'deactivated' ? '#0191DA' : 'white',
            color: activeTab === 'deactivated' ? 'white' : '#666',
            borderColor: activeTab === 'deactivated' ? '#0191DA' : '#ddd'
          }}
          onClick={() => setActiveTab('deactivated')}
        >
          Deactivated Templates (2)
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
        <TextField
          variant='outlined'
          placeholder='Search templates'
          size='small'
          sx={{
            minWidth: '300px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
              '& fieldset': { borderColor: '#ddd' }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant='outlined'
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            color: '#666',
            borderColor: '#ddd',
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Reset Filters
        </Button>
      </Stack>

      {/* Table */}
      <BasicTable />
    </Box>
  )
}
