'use client'

import React from 'react'
import { Box, Card, Typography, Divider, Button, Grid } from '@mui/material'
import DynamicTable from '@/components/Table/dynamicTable'
import { useRouter } from 'next/navigation'
import ListAltIcon from '@mui/icons-material/ListAlt'
import WorkIcon from '@mui/icons-material/Work'
import CustomTable from '@/components/Table/CustomTable'
import sampleEmployeeData from '@/utils/sampleData/sampleEmployeeData.json'

interface ViewBranchProps {
  mode: string
  id: string
}

const ViewBranch: React.FC<ViewBranchProps> = ({ mode, id }) => {
  const router = useRouter()

  // Simulated data for demonstration purposes
  const branchData = {
    id: id,
    name: 'Downtown Branch',
    location: '123 Main Street, New York, NY',
    totalEmployees: 150,
    turnover: '$1.2M',
    bucketLevel: 'Level 3',
    totalVacancy: 12,
    bubblePositionCount: 5
  }

  // Sample employee data

  const employeeData: any[] = sampleEmployeeData

  // Employee table columns
  // const employeeColumns = [
  //   {
  //     header: 'ID',
  //     accessorKey: 'id',
  //     cell: (info: any) => info.getValue()
  //   },
  //   {
  //     header: 'Name',
  //     accessorKey: 'name',
  //     cell: (info: any) => info.getValue()
  //   },
  //   {
  //     header: 'Age',
  //     accessorKey: 'age',
  //     cell: (info: any) => info.getValue()
  //   },
  //   {
  //     header: 'Email',
  //     accessorKey: 'email',
  //     cell: (info: any) => info.getValue()
  //   },
  //   {
  //     header: 'Designation',
  //     accessorKey: 'designation',
  //     cell: (info: any) => info.getValue()
  //   },
  //   {
  //     header: 'Blood Group',
  //     accessorKey: 'blood',
  //     cell: (info: any) => info.getValue()
  //   }
  // ]

  const employeeColumns = [
    { header: 'ID', accessorKey: 'employeeCode' },
    { header: 'Name', accessorKey: 'First Name' },
    { header: 'Employment Status', accessorKey: 'Employment Status' },
    { header: 'Email', accessorKey: 'Personal Email Address' },
    { header: 'Designation', accessorKey: 'Title' }
  ]

  // Button action function
  const handleButtonClick = (rowData: any) => {
    // alert(`Action performed on ${rowData.id}`)
    router.push(`/employee-details?employeeId=${rowData.employeeCode}`)
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Branch Details */}
      <Card sx={{ padding: 4, marginBottom: 4 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <Typography variant='h5'>Branch Details</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<ListAltIcon />}
                onClick={() => router.push('/bucket-management')}
                size='small'
              >
                Bucket Management
              </Button>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<WorkIcon />}
                onClick={() => router.push(`/vacancy-management?branchId=${id}`)}
                size='small'
              >
                Vacancy Management
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>ID:</strong> {branchData.id}
            </Typography>
            <Typography variant='body1'>
              <strong>Name:</strong> {branchData.name}
            </Typography>
            <Typography variant='body1'>
              <strong>Location:</strong> {branchData.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>Total Employees:</strong> {branchData.totalEmployees}
            </Typography>
            <Typography variant='body1'>
              <strong>Turnover:</strong> {branchData.turnover}
            </Typography>
            <Typography variant='body1'>
              <strong>Bucket Level:</strong> {branchData.bucketLevel}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              <strong>Total Vacancy:</strong> {branchData.totalVacancy}
            </Typography>
            <Typography variant='body1'>
              <strong>Bubble Position Count:</strong> {branchData.bubblePositionCount}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Employee Details Table */}
      {/* <Card sx={{ padding: 4 }}>
        <Typography variant='h5' sx={{ marginBottom: 2 }}>
          Employee Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <DynamicTable columns={employeeColumns} data={employeeData} />
      </Card> */}
      <Card sx={{ padding: 4 }}>
        <Typography variant='h5' sx={{ marginBottom: 2 }}>
          Employee Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <CustomTable
          columns={employeeColumns}
          data={employeeData}
          showCheckbox={false}
          showActionButton={true}
          buttonLabel='View'
          buttonAction={handleButtonClick}
        />
      </Card>
    </Box>
  )
}

export default ViewBranch
