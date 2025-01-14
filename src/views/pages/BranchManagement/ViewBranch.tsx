'use client'

import React from 'react'
import {
  Box,
  Card,
  Typography,
  Divider,
} from '@mui/material'
import DynamicTable, { Person } from '@/components/Table/dynamicTable'

interface ViewBranchProps {
  mode: string
  id: string
}

const ViewBranch: React.FC<ViewBranchProps> = ({ mode, id }) => {
  // Simulated data for demonstration purposes
  const branchData = {
    id: id,
    name: 'Downtown Branch',
    location: '123 Main Street, New York, NY',
    totalEmployees: 150,
    turnover: '$1.2M',
    bucketLevel: 'Level 3',
  }

  // Sample employee data
  const employeeData: Person[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com',designation:'Branch Manager'},
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com', designation:'Area Manager' },
    { id: 3, name: 'Emily Davis', age: 35, email: 'emily.davis@example.com', designation:'Area Manager' },
    { id: 4, name: 'Michael Brown', age: 40, email: 'michael.brown@example.com', designation:'Sales Executive' },
    { id: 5, name: 'Sarah Wilson', age: 29, email: 'sarah.wilson@example.com', designation:'Sales Executive' },
    { id: 6, name: 'David Clark', age: 33, email: 'david.clark@example.com', designation:'Sales Executive' },
  ]

  // Employee table columns
  const employeeColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Age',
      accessorKey: 'age',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Designation',
      accessorKey: 'designation',
      cell: (info: any) => info.getValue(),
    },
  ]

  return (
    <Box sx={{ padding: 4 }}>
      {/* Branch Details */}
      <Card sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Branch Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <Typography variant="body1">
          <strong>ID:</strong> {branchData.id}
        </Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {branchData.name}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {branchData.location}
        </Typography>
        <Typography variant="body1">
          <strong>Total Employees:</strong> {branchData.totalEmployees}
        </Typography>
        <Typography variant="body1">
          <strong>Turnover:</strong> {branchData.turnover}
        </Typography>
        <Typography variant="body1">
          <strong>Bucket Level:</strong> {branchData.bucketLevel}
        </Typography>
      </Card>

      {/* Employee Details Table */}
      <Card sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Employee Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <DynamicTable<Person> columns={employeeColumns} data={employeeData} />
      </Card>
    </Box>
  )
}

export default ViewBranch
