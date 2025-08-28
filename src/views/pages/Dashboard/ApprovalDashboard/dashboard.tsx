'use client'

import React, { useState } from 'react'
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
  Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TableViewIcon from '@mui/icons-material/TableView'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import BlockIcon from '@mui/icons-material/Block'
import DashboardCard from '@/components/cards/approvaldashboardCard'

const DATA_GRID = [
  {
    id: 1,
    fileName: 'Q4 2023 Financial Report',
    submitter: 'Alice Johnson',
    department: 'Finance',
    submissionDate: '2024-03-01',
    status: 'Pending',
    approvedCount: 0,
    pendingCount: 1,
    rejectedCount: 0
  },
  {
    id: 2,
    fileName: 'New Marketing Campaign Plan',
    submitter: 'Carol Parker',
    department: 'Marketing',
    submissionDate: '2024-02-28',
    status: 'Approved',
    approvedCount: 1,
    pendingCount: 0,
    rejectedCount: 0
  },
  {
    id: 3,
    fileName: 'HR Policy Updated 2024',
    submitter: 'Chris Evans',
    department: 'HR',
    submissionDate: '2024-02-25',
    status: 'Rejected',
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 1
  },
  {
    id: 4,
    fileName: 'HR Policy Updated 2024',
    submitter: 'Alice Johnson',
    department: 'Engineering',
    submissionDate: '2024-02-18',
    status: 'Approved',
    approvedCount: 1,
    pendingCount: 0,
    rejectedCount: 0
  },
  {
    id: 5,
    fileName: 'HR Policy Updated 2024',
    submitter: 'Tom Hiddleston',
    department: 'Marketing',
    submissionDate: '2024-03-01',
    status: 'Rejected',
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 1
  },
  {
    id: 6,
    fileName: 'Product Features v1.3',
    submitter: 'Chris Hemsworth',
    department: 'Marketing',
    submissionDate: '2024-02-25',
    status: 'Approved',
    approvedCount: 1,
    pendingCount: 0,
    rejectedCount: 0
  },
  {
    id: 7,
    fileName: 'Q4 2023 Financial Report',
    submitter: 'Chris Evans',
    department: 'Engineering',
    submissionDate: '2024-04-19',
    status: 'Pending',
    approvedCount: 0,
    pendingCount: 1,
    rejectedCount: 0
  }
]

function BasicTable() {
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
          {DATA_GRID.map(row => (
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

function GridView() {
  return (
    <Grid container spacing={2}>
      {DATA_GRID.map(item => (
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all')

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'table') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode)
    }
  }

  const filteredData = DATA_GRID.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return item.status === 'Pending'
    if (activeTab === 'completed') return item.status === 'Approved'
    if (activeTab === 'rejected') return item.status === 'Rejected'
    return true
  })
  const cardData = [
    {
      title: 'Pending Reviews',
      value: 1128,
      description: 'Currently Operational Templates'
    },
    {
      title: 'Approved Last Week',
      value: 145,
      description: 'Archive or Inactive Templates'
    },
    {
      title: 'Rejected Last Week',
      value: 1128,
      description: 'Templates Awaiting Admin Approvals'
    },
    {
      title: 'Total Processed',
      value: 1128,
      description: 'Added This Month'
    }
  ]
  return (
    <Box sx={{ p: 4, backgroundColor: '#EFF1FF', minHeight: '100vh' }}>
      <Typography variant='h4' mb={4}>
        Approval Dashboard
      </Typography>

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
            />
            <TextField
              select
              size='small'
              label='Department'
              defaultValue='All'
              sx={{ backgroundColor: 'white', minWidth: 120 }}
              SelectProps={{ native: true }}
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
              defaultValue='All'
              sx={{ backgroundColor: 'white', minWidth: 120 }}
              SelectProps={{ native: true }}
            >
              <option value='All'>All</option>
              <option value='Pending'>Pending</option>
              <option value='Approved'>Approved</option>
              <option value='Rejected'>Rejected</option>
            </TextField>
            <Button variant='outlined'>Reset Filters</Button>
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
        <GridView />
      ) : (
        <Box sx={{ height: 640, width: '100%' }}>
          <BasicTable />
        </Box>
      )}
    </Box>
  )
}

export default DataGridView
