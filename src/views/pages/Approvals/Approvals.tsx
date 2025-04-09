'use client'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Card, Typography, IconButton, Tab, Tabs, Grid, InputAdornment } from '@mui/material'
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DynamicTable from '@/components/Table/dynamicTable'

import DynamicTextField from '@/components/TextField/dynamicTextField'
import MyDashboard from './Dashboard'
import { createColumnHelper } from '@tanstack/react-table'

const ApprovalManagement = () => {
  const router = useRouter()
  const columnHelper = createColumnHelper()

  const statusColors = {
    Completed: '#059669',
    Pending: '#D97706',
    Overdue: '#F00'
  }

  // Demo data for the table
  const demoApprovalData = [
    {
      id: 1,
      name: 'Budget Approval',
      description: 'Approval process for budget allocations',
      approvalCategory: 'Finance',
      numberOfLevels: 2,
      approver: 'Manager',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Project Plan',
      description: 'Approval for project timeline and resources',
      approvalCategory: 'Operations',
      numberOfLevels: 3,
      approver: 'Director',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Vendor Contract',
      description: 'Approval for vendor agreements',
      approvalCategory: 'Procurement',
      numberOfLevels: 1,
      approver: 'Procurement Lead',
      status: 'Overdue'
    },
    {
      id: 4,
      name: 'Expense Report',
      description: 'Approval for employee expenses',
      approvalCategory: 'HR',
      numberOfLevels: 2,
      approver: 'HR Manager',
      status: 'Completed'
    }
  ]
  const [activeTab, setActiveTab] = useState(0)
  const [approvals] = useState([
    {
      id: 1,
      title: 'Completed Approvals',
      icon: <LibraryAddCheckIcon color='success' />,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Pending Approvals',
      icon: <PendingActionsIcon color='warning' />,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Overdue Approvals',
      icon: <RunningWithErrorsIcon color='error' />,
      status: 'overdue'
    }
  ])

  const getOverdueCount = () => {
    const currentDate = new Date()
    return demoApprovalData.filter(item => {
      const approvalDueDate = new Date() // Simplified for demo
      return item.status.toLowerCase() === 'overdue' && approvalDueDate < currentDate
    }).length
  }

  const getStatusCount = status => {
    return demoApprovalData.filter(item => item.status.toLowerCase() === status).length
  }

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Sl No',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>
      }),
      columnHelper.accessor('approvalCategory', {
        header: 'Approval Category',
        cell: ({ row }) => <Typography>{row.original.approvalCategory || '-'}</Typography>
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Typography>{row.original.description || '-'}</Typography>
      }),

      columnHelper.accessor('numberOfLevels', {
        header: 'Number of Levels',
        cell: ({ row }) => <Typography>{row.original.numberOfLevels || '-'}</Typography>
      }),
      columnHelper.accessor('approver', {
        header: 'Approver',
        cell: ({ row }) => <Typography>{row.original.approver || '-'}</Typography>
      }),

      columnHelper.accessor('Action', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton title='Edit'>
            <VisibilityIcon sx={{ fontSize: '200px' }} />
          </IconButton>
        )
      })
    ],
    []
  )

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <Card>
        <Box sx={{ display: 'flex', padding: 3 }}>
          <DynamicTextField
            label='Search Roles'
            variant='outlined'
            // onChange={handleSearch}
            // value={searchText}
            placeholder='Search roles...'
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <i className='tabler-search text-xxl' />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Card>
      <Grid className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 '>
        {approvals.map(approval => (
          <Card
            key={approval.id}
            sx={{
              cursor: 'pointer',
              padding: 2,
              boxShadow: 'none', // Remove shadow
              borderBottom: `4px solid ${statusColors[approval.status.charAt(0).toUpperCase() + approval.status.slice(1)] || 'inherit'}`
            }}
          >
            <Grid className='flex justify-between items-center mb-2'>
              <Typography variant='h6' component='div'>
                {approval.title}
              </Typography>
              {approval.icon}
            </Grid>
            <Typography variant='body2' color='textSecondary'>
              {approval.status === 'overdue'
                ? getOverdueCount() + ' Overdue Approvals'
                : approval.status === 'pending'
                  ? getStatusCount('pending') + ' Pending Approvals'
                  : getStatusCount(approval.status) + ' Approvals'}
            </Typography>
          </Card>
        ))}
      </Grid>
      {/* <Box className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
        <MyDashboard />
      </Box>
      <Box className='p-4'>
        <DynamicTable columns={columns} data={demoApprovalData} />
      </Box> */}

      {/* <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 2 }} // Adds some margin bottom
        >
          <Tab label='Table' />
          <Tab label='MyDashboard' />
        </Tabs> */}

      <Box className='mt-5'>
        <DynamicTable 
        columns={columns} 
        data={demoApprovalData}
        tableName = 'Approval List' />
      </Box>
    </>
  )
}

export default ApprovalManagement
